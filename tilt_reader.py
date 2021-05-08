#!/usr/bin/env python3
""" tilt_reader.py
Run python tilt_reader.py to start an asyncio loop that scans for tilt messages
and attempt to post the readings back to the endpoint defined at TILT_POST_URL.

The code is based off of the aioblescan (https://github.com/frawau/aioblescan)
and the tilt class is an updated version of the tilt plugin for aioblescan
(https://github.com/baronbrew/aioblescan/tree/master/aioblescan) and now works
with aioblescan v 0.2.6

NOTE: if permission errors arise in running bluetooth commands, you may need to
run sudo setcap 'cap_net_raw,cap_net_admin+eip' `which python` (or python3)
to set the proper permissions for python similar to the information in:
https://kvurd.com/blog/tilt-hydrometer-ibeacon-data-format/
"""
import argparse
import asyncio
from datetime import datetime
from struct import unpack
import os

import requests
import aioblescan as aiobs

# the previous version used a format based on the iBeacon format and included the
# Apple iBeacon identifier portion (4c000215) as well as Tilt specific uuid preamble (a495)
# in aioblescan v.0.2.6 the manufacuctuer id is now an int (0x4c = 76 for Tilt) and no longer
# includes the trailing bytes 00 (4c00). The Tilt specific preamble is now in a separate
# portion of the packet and is defined here as a separate variable. Both are used to
# identify Tilt messages
# TILT = "4c000215a495"
TILT_MFG_INT = 76
TILT_MFG_ID = "0215a495"

global TILT_POST_URL

TILT_POST_URL = os.environ.get('TILT_POST_URL')

# tilt hex addresses
TILTS = {
    "a495bb10c5b14b44b5121370f02d74de": "red",
    "a495bb20c5b14b44b5121370f02d74de": "green",
    "a495bb30c5b14b44b5121370f02d74de": "black",
    "a495bb40c5b14b44b5121370f02d74de": "purple",
    "a495bb50c5b14b44b5121370f02d74de": "orange",
    "a495bb60c5b14b44b5121370f02d74de": "blue",
    "a495bb70c5b14b44b5121370f02d74de": "yellow",
    "a495bb80c5b14b44b5121370f02d74de": "pink",
}


class Tilt:
    """
    Class defining the content of a Tilt advertisement
    """
    @classmethod
    def decode(self, packet):
        data = {}
        # if it exists, this is a one element list containing a ManufacturerSpecificData object
        raw_data_list = packet.retrieve("Manufacturer Specific Data")

        if isinstance(raw_data_list, list) and len(raw_data_list) > 0:
            try:
                raw_data = raw_data_list[0].payload
                pckt = raw_data[1].val
                mfg_id = pckt.hex()[:8]

                # we don't need these values for Tilt
                # rssi = packet.retrieve('rssi')
                # mac = packet.retrieve("peer")

                if raw_data[0].val == TILT_MFG_INT and mfg_id == TILT_MFG_ID:

                    # NOTE: all list indicies are shifted left by 2 from the previous version
                    data["uuid"] = pckt.hex()[4:36]
                     #temperature in degrees F
                    data["major"] = unpack(">H", pckt[18:20])[0]
                    # specific gravity x 1000
                    data["minor"] = unpack(">H", pckt[20:22])[0]
                    # NOTE: two different values appear on different iterations of this, so I am unsure of this
                    # weeks since battery change (0-152 when converted to unsigned 8 bit integer) and other TBD operation codes
                    data["tx_power"] = unpack(">b", pckt[22:23])[0]
                    data["color"] = TILTS[data.get("uuid")]
                    data["timestamp"] = datetime.now().isoformat()

                    # not needed for Tilt data
                    # data['rssi'] = rssi[-1].val
                    # data['mac'] = mac[-1].val

            except Exception as e:
                data["error"] = e

        if data:
            try:
                requests.post(TILT_POST_URL, json=data)

            # TODO: add logging and possibly email alert(?)
            except requests.exceptions.ConnectionError as e:
                # print(e)
                # raise KeyboardInterrupt
                pass

            # print(data)


def tilt_process(data):
    ev = aiobs.HCI_Event()
    ev.decode(data)
    Tilt.decode(ev)


def main():
    event_loop = asyncio.get_event_loop()
    # First create and configure a raw socket
    mysocket = aiobs.create_bt_socket(0)

    # create a connection with the raw socket - This now requires a STREAM socket.
    fac = event_loop._create_connection_transport(
        mysocket, aiobs.BLEScanRequester, None, None
    )
    # Start it
    conn, btctrl = event_loop.run_until_complete(fac)

    # Attach Tilt processing
    btctrl.process = tilt_process

    # Probe for messages
    btctrl.send_scan_request()

    try:
        print("Scanning for Tilts")
        event_loop.run_forever()

    except KeyboardInterrupt:
        print("keyboard interrupt")

    finally:
        print("closing event loop")
        btctrl.stop_scan_request()
        command = aiobs.HCI_Cmd_LE_Advertise(enable=False)
        btctrl.send_command(command)
        conn.close()
        event_loop.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--route', '-r', help='Fully qualifed url for posting tilt readings.')
    args = parser.parse_args()
    if args.route:
        TILT_POST_URL = args.route
        print(TILT_POST_URL)
    else:
        print(TILT_POST_URL)

    main()

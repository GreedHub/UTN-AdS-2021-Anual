import React, { useEffect, useState } from "react";
import { PromiseHandler, time } from "../../../helpers";
import { device as deviceService } from "../../../services";
import { Reading } from "../../../types";
import TempGraph from "../../tempGraph";
import './content.scss';

export default function Content(){

    const [tempDevices,setTempDevices] = useState<{readings:Reading[],name:string}[]>([]);

    const loadDeviceData = async()=>{
        let [_tempDevice,err] = await PromiseHandler(deviceService.getDeviceReadings(
            "TEMP_SENSOR"
        ));
        if(err){
            console.error(err);
            return
        }

        let [_tempDevice2,err2] = await PromiseHandler(deviceService.getDeviceReadings(
            "TEMP_SENSOR"
        ));
        if(err2){
            console.error(err2);
            return
        }

        _tempDevice.readings = _tempDevice.readings.map((reading:Reading)=>{
            reading["timestamp"] = time.toLocalTime(reading.timestamp);
            return reading;
        })

        _tempDevice2.readings = _tempDevice2.readings.map((reading:Reading)=>{
            reading["timestamp"] = time.toLocalTime(reading.timestamp);
            return reading;
        })

        setTempDevices([_tempDevice, _tempDevice2]);

        console.log(tempDevices)

    }

    useEffect(()=>{
        loadDeviceData();
    },[])

    return(
        <div className="Content">
            {tempDevices.map(device=><TempGraph data={device.readings} deviceName={`${device.readings.pop()?.name}`}/>)}
        </div>
    )
}
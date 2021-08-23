import React, { useEffect, useState } from "react";
import { PromiseHandler, time } from "../../../helpers";
import { device as deviceService } from "../../../services";
import { Reading } from "../../../types";
import StatusGraph from "../../statusGraph";
import TempGraph from "../../tempGraph";
import './content.scss';

export default function Content(){

    const [tempDevices,setTempDevices] = useState<{readings:Reading[],name:string}[]>([]);
    const [systemStatus,setSystemStatus] = useState<string>("unknown");

    const loadDeviceData = async()=>{
        let [_tempDevice,err] = await PromiseHandler(deviceService.getDeviceReadings(
            "TEMP_SENSOR"
        ));
        if(err){
            console.error(err);
            return
        }
        let [_tempDevice2,err2] = await PromiseHandler(deviceService.getDeviceReadings(
            "TEMP_SENSOR_2"
        ));
        if(err2){
            console.error(err2);
            return
        }
        let [_statusLight,err3] = await PromiseHandler(deviceService.getDeviceReadings(
            "STATUS_LIGHT",
            undefined,
            {last:1}
        ));
        if(err3){
            console.error(err2);
            return
        }


        _tempDevice.readings = _tempDevice.readings.map((reading:Reading)=>{
            reading["timestamp"] = time.toLocalTime(reading.timestamp);
            return reading;
        })
        _tempDevice.name = "Temp Sensor"

        _tempDevice2.readings = _tempDevice2.readings.map((reading:Reading)=>{
            reading["timestamp"] = time.toLocalTime(reading.timestamp);
            return reading;
        })
        _tempDevice2.name = "Temp Sensor 2"

        setTempDevices([_tempDevice, _tempDevice2]);
        setSystemStatus(_statusLight.readings[0].value);

    }

    useEffect(()=>{
        loadDeviceData();
    },[])

    return(
        <div className="Content">
            <StatusGraph status={systemStatus}></StatusGraph>
            {tempDevices.map((device,index)=><TempGraph key={index} data={device.readings} deviceName={`${device.name} (${device.readings.pop()?.name})`}/>)}
        </div>
    )
}
import http, { setResponseCallback } from "k6/http"
import {Counter} from "k6/metrics"
import { check,sleep } from "k6"

const allowed=new Counter("allowed_requests")
const blocked=new Counter("blocked_requests")

// export const options={
//     vus:20,
//     duration:"15s",
// }

export const options={
  scenarios:{
    traffic:{
      executor:"ramping-vus",
      stages:[
        {duration:"10s",target:10},
        {duration:"20s",target:50},
        {duration:"20s",target:100},
        {duration:"10s",target:0},
      ],
    },
  }, 
  thresholds: {
    checks: ["rate>0.99"],
    http_req_duration: ["p(95)<50"],
  },
};

const params={
        responseCallback:http.expectedStatuses(200,429)
    }
export default function(){
    const response=http.get("http://localhost:5000/",params)

    check(response,{
        "allowed or blocked":(r)=> r.status===200 || r.status===429
        
    })
    if(response.status===200)allowed.add(1)
    if(response.status===429)blocked.add(1)
    sleep(0.1)
}
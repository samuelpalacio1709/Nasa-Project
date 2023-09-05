const API_URL = "http://localhost:8000"

async function httpGetPlanets() {
  
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches =await response.json();
  return fetchedLaunches.sort((x,y)=>x.flightNumber-y.flightNumber)
}

async function httpSubmitLaunch(launch) {
    try{
      return  fetch(`${API_URL}/launches`, {
        method: "post",
        headers  : {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(launch)
      })
    }
    catch{
      return {ok: false}
    }
}

async function httpAbortLaunch(id) {
  try{
    return  fetch(`${API_URL}/launches/${id}`, {
      method: "delete"
    })
  }
  catch{
    return {ok: false}
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
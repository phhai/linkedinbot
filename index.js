require('dotenv').config()
require('./lib/sentry');
let sleep = require('sleep');

let {addConnection, getIndustryLeaders, getSoftwareEngineers} = require('./linkedin/linkedin');
const { readConfig, writeConfig } = require('./lib/storage')

// add a connection after every 5 minutes
const PENDING_TIME_TO_ADD_CONNECTION = 5 * 60 * 1000;

const runBot = async () => {
  let config = readConfig();
  config.number_of_connect_last_time = 0;
  let listPeople = [];
  const listIndustryLeaders = await getIndustryLeaders(config.page);
  if (listIndustryLeaders || listIndustryLeaders.elements || listIndustryLeaders.elements.length > 0) {
    listPeople = [...listPeople, ...listIndustryLeaders.elements[0].elements];
  }

  const listSoftwareEngineers = await getSoftwareEngineers(config.page);
  if (listSoftwareEngineers || listSoftwareEngineers.elements || listSoftwareEngineers.elements.length > 0) {
    listPeople = [...listPeople, ...listSoftwareEngineers.elements[0].elements];
  }

  for(let i = 0; i< listPeople.length; i++) {
    let person = listPeople[i];
    if (person) {
      let targetUrns = person.targetUrn.split(':');
      let profile = targetUrns[targetUrns.length - 1];
      let trackingId = person.trackingId;
      let isAddSuccessed = await addConnection(profile, trackingId);
      if (isAddSuccessed) {
        config.number_of_connect_last_time++;
        config.total_connect++;
      }
    }
    sleep.msleep(PENDING_TIME_TO_ADD_CONNECTION);
  }
  config.page++;
  writeConfig(config);
}

runBot();

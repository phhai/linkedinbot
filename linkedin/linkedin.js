const axios = require('axios');
const Sentry = require('@sentry/node');

const HEADERS = {
  'host':'www.linkedin.com',
  'x-restli-protocol-version':'2.0.0',
  'x-li-track':':{"mpVersion":"9.15.1620.1","osName":"iOS","clientVersion":"9.15.1620.1","timezoneOffset":7,"osVersion":"13.3.1","appId":"com.linkedin.LinkedIn","locale":"en_VN","deviceType":"iphone","displayDensity":2,"clientMinorVersion":"2020.03.27","deviceId":"69763C4A-C5A8-43BE-9B41-2B10A9219749","language":"en-VN","model":"iphone11_8","carrier":"VinaPhone","mpName":"voyager-ios"}',
  'accept':'application/vnd.linkedin.mobile.deduped+json',
  'x-li-lang':'en-US',
  'csrf-token':`${process.env.CSRD_TOKEN}`,
  'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) LinkedIn/9.15.1620.1 Version/10.0 Mobile/15E148 Safari/605.1',
  'accept-encoding':'gzip, deflate',
  'accept-language':'vi-VN,vi,fr-FR,fr,en-US,en',
  'cookie':`${process.env.COOKIE}`
}

const NUMBER_OF_PEOPLE_PER_PAGE = 10;

getIndustryLeaders = async (page) => {
  console.log('Getting list industry leaders');
  let params = {
    'count':NUMBER_OF_PEOPLE_PER_PAGE,
    'filters':'List(resultType->PEOPLE,serviceCategory->602)',
    'origin':'FACETED_SEARCH',
    'q':'all',
    'queryContext':'List(spellCorrectionEnabled->true,relatedSearchesEnabled->true,kcardTypes->PROFILE|COMPANY|JOB_TITLE)',
    'start':NUMBER_OF_PEOPLE_PER_PAGE * page
  };
  let result = await search(params);
  return result;
}

getSoftwareEngineers = async (page) => {
  console.log('Getting list software engineers');
  let params = {
    'count':NUMBER_OF_PEOPLE_PER_PAGE,
    'filters':'List(resultType->PEOPLE,industry->96|4)',
    'origin':'FACETED_SEARCH',
    'q':'all',
    'queryContext':'List(spellCorrectionEnabled->true,relatedSearchesEnabled->true,kcardTypes->PROFILE|COMPANY|JOB_TITLE)',
    'start':NUMBER_OF_PEOPLE_PER_PAGE * page
  };
  let result = await search(params);
  return result;
}

addConnection = async (profileId, trackingId) => {
  console.log('Adding connection to profileId/trackingId:', profileId, trackingId);
  let isAddConnectionSuccessed = false;
  const url = "https://www.linkedin.com/voyager/api/voyagerGrowthNormInvitations"

  const data = {
    "invitee": {
        "com.linkedin.voyager.growth.invitation.InviteeProfile": {
            "profileId": profileId
        }
    },
    "trackingId": trackingId
  };

  try {
    await axios.post(url, data, {
      headers: HEADERS,
    })
    .then(function (response) {
      if (response.status == 201) {
        console.log('Added a connection successfully!')
        isAddConnectionSuccessed = true;
      }
    });
  } catch (e) {
    console.log('Failed to add a connection!')
    Sentry.captureException(e);
  }
  return isAddConnectionSuccessed;
}

search = async (params) => {
  const url = 'https://www.linkedin.com/voyager/api/voyagerSearchBlendedSearchClusters';
  let data = null;
  await axios.get(url,{
    params: params,
    headers: HEADERS,
  })
  .then(function (response) {
    data = response.data;
  });
  return data;
}

exports.getIndustryLeaders = getIndustryLeaders;
exports.getSoftwareEngineers = getSoftwareEngineers;
exports.addConnection = addConnection;

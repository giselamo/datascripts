const fs = require('fs');
const apps = require('./applicationssource.json');
const oldApps = require ('./applicationssourceOLD.json');
const leadforms = require('./leadforms.json');
const twilioRobocalls = require('./robotCallsTwilio.json');
const callsReceiveInSMSPhone = require('./callsReceiveInSMSPhone.json');
const blacklist = require('./blacklist.json');

const blacklistArray = blacklist.blacklistPhones;

const applications = apps['applications-export'];

const callsReceiveSMSPhone = callsReceiveInSMSPhone.callsReceiveInSMSPhone;

const leadformsList = leadforms.Sheet1;

const jobids = applications.map (x=> (x.JobId));

//processing old applications to get old jobs
const oldAppsList = oldApps['applications-export'];
const jobidsOnlyOLD = oldAppsList.map(x=> (x.JobId));
const jobidOLDSet = new Set (jobidsOnlyOLD);
const jobidOLDArray = Array.from (jobidOLDSet);



const jobIdsSet = new Set (jobids);

const jobIdsArray = Array.from (jobIdsSet);


const jobidExistingPreviousWeek = jobIdsArray.filter(x=>(jobidOLDArray.includes(x)));
const newjobsIdsThisWeek= jobIdsArray.filter(x=> (!jobidOLDArray.includes(x)));

const status = ['Hired', 'NotQualified', 'Notinterested', 'ScheduledInterview'];

const excludedApps = applications.filter(x=> (status.includes(x['Application Status'])));

const postaApps = applications.filter(x=> (!status.includes(x['Application Status'])));
 

// Ver con Fer si se hay alguna API que pueda usar para consultar setting per lead form

const jobidWithFlag = leadformsList.map(x=> (x.Id.substring(1)));
const pendingJobs = jobIdsArray.filter (x=> (!jobidWithFlag.includes(x)));

 if (pendingJobs.length > 0){
 console.log("There is one job that have no lead form setting =", pendingJobs.length);
 console.error(pendingJobs);
 return;
}

//Applications which are linked to a lead form with Confirm Application = No 

const jobsWithNo = leadformsList.filter(x=> (x['Lead Form with Request Confirmation ='] === 'No'));
const jobsWithNoSINJ = jobsWithNo.map(x=> x.Id.substring(1));
const appsWithoutRoboCall = postaApps.filter(x=> (jobsWithNoSINJ.includes(x.JobId)));
const appsThatShouldHaveRobotCall = postaApps.filter (x=> (!jobsWithNoSINJ.includes(x.JobId)));


// Get calls received in SMS phone number grouped by From
const callsReceiveFromOnly = callsReceiveSMSPhone.map(x=> (x.From));
const callsReceivedSet = new Set (callsReceiveFromOnly);


//Get Robotcalls from Twilio and grouped by "To"
const robotcallsTwilio = twilioRobocalls.robotcalls
const ToPhones = robotcallsTwilio.map (x=> (x.To));

const ToPhonesSet = new Set (ToPhones);

const ToPhonesArray = Array.from (ToPhonesSet);



//console.log("RoboticPhoneNUmbers = ",ToPhonesArray);

const postaAppsWithPhone = appsThatShouldHaveRobotCall.filter(x=> x.Phone);
const postaAppsWithoutPhone = appsThatShouldHaveRobotCall.filter(x=> !x.Phone);


if (postaAppsWithoutPhone.length > 0){
  console.log("There are applications WITHOUT phone:",postaAppsWithoutPhone.length);
}

//Verifico si todos los phones de las applicatins (postaAppWithPhone) tienen una robot call en twilio
const appsPhoneFormated = postaAppsWithPhone.map(x=> ({
  phone: x.Phone.replace(/[^\d]/g, ''),
  jobid: x.JobId, 
}));


const applicationsMissingRobotCall = appsPhoneFormated.filter(x=>(!ToPhonesArray.includes(x.phone)));

const blacKlistOnlyPhones = blacklistArray.map(x=> x.recipient);
//console.log (blacKlistOnlyPhones);

const applicationsMissingRobotCallNOTinBlackList = applicationsMissingRobotCall.filter(x=>(!blacKlistOnlyPhones.includes(x.phone)));

const applicationsINBlackList = applicationsMissingRobotCall.filter(x=>(blacKlistOnlyPhones.includes(x.phone)));


 if (applicationsMissingRobotCall.length > 0){
 
 console.log("Applicants in Black List =",applicationsINBlackList.length);
 console.log("Applicants that should have received a robot call=",applicationsMissingRobotCallNOTinBlackList.length);
 console.log("------------------------------------------------------------");

  const values = applicationsMissingRobotCallNOTinBlackList
    .map(x => `(phone: ${x.phone}, jobid: ${x.jobid})`)
    .join("\n");
 
 fs.writeFileSync('./phones.txt', values);
 }


function reductor(acumulado, item) {
  if (acumulado[item.JobId] === undefined) {
    acumulado[item.JobId] = 1;
  } else {
    acumulado[item.JobId] += 1;
  }
  return acumulado;
}

const result = applications.reduce(reductor, {});




// Todas las applications with email
const jobsWithYes = leadformsList.filter(x=> (x['Lead Form with Request Confirmation ='] === 'Yes')).map(x=> x.Id.substring(1));

const appsWithEmail = postaApps.filter(x=> (x.Email))
                      .filter (x=> jobsWithYes.includes(x.JobId));




//links.redirection.module.group.item.filter(x => x.statistic['-access'] > '2016-10-14' && x.statistic['-access'] < '2016-10-18').filter(x => x.title === 'Te ayudamos con tu postulación');

//const itemsDistintos = itemsInteresantes.filter(x => !itemIds.includes(x['-id']));

//itemsDistintos.map(x => console.log(x));

//console.log(itemsDistintos.length);

//const urls = itemsInteresantes.map(x => ({option: x.action['#text'], count: x.statistic['-count']}));

//const stats = urls.map(x => ({count: x.count, option: parser.parse(x.option, true).query.utm_txtoption}));



console.log('Number of Jobs= ',jobIdsSet.size); 
console.log('Number of Applicants= ',applications.length);
console.log('Number of Excluded= ',excludedApps.length);
console.log('Number of Good Applicants(meaning excluding the status)= ',postaApps.length);
console.log('Number of Applicants WITH PHONE and that should receive Robot call= ',postaAppsWithPhone.length);
console.log('Applicants Without Robot Call= ',appsWithoutRoboCall.length);
console.log('Number of Robot Calls in Twilio= ',ToPhonesSet.size);
console.log('Applicants we sent Email Verification= ',appsWithEmail.length);
console.log('Calls Received inSMS Phone number=', callsReceivedSet.size);

console.log('JOBS FROM PREVIOUS WEEK=', jobidExistingPreviousWeek.length);
console.log('NEW JOBS THIS WEEK =',newjobsIdsThisWeek.length);

const testroot = require ('./testAB.json');

const testList = testroot.Dataset1;

const testsOptionA = testList.filter(x=> (x['Test AB'] === 'SMS with link A'));

const testsOptionB = testList.filter(x=> (x['Test AB'] === 'SMS with link B'));

const testsOptionC = testList.filter(x=> (x['Test AB'] === 'SMS with link C'));


const statsA = testsOptionA.map(x => (parseInt (x['Total Events'])));
const statsB = testsOptionB.map(x => (parseInt (x['Total Events'])));
const statsC = testsOptionC.map(x => (parseInt (x['Total Events'])));


const ANo = testsOptionA.filter(x=>  x['Event Label'].indexOf('- no')>=0);
const AHadInterview = testsOptionA.filter(x=>  x['Event Label'].indexOf('yes_had_interview')>=0);
const AInterviewScheduled = testsOptionA.filter(x=>  x['Event Label'].indexOf('yes_scheduled')>=0);
const ANotInvited = testsOptionA.filter(x=>  x['Event Label'].indexOf('yes_not_invited')>=0);
const ANotInterested = testsOptionA.filter(x=>  x['Event Label'].indexOf('yes_not_interested')>=0);


const BNo = testsOptionB.filter(x=>  x['Event Label'].indexOf('- no')>=0);
const BHadInterview = testsOptionB.filter(x=>  x['Event Label'].indexOf('yes_had_interview')>=0);
const BInterviewScheduled = testsOptionB.filter(x=>  x['Event Label'].indexOf('yes_scheduled')>=0);
const BNotInvited = testsOptionB.filter(x=>  x['Event Label'].indexOf('yes_not_invited')>=0);
const BNotInterested = testsOptionB.filter(x=>  x['Event Label'].indexOf('yes_not_interested')>=0);

const CNo = testsOptionC.filter(x=>  x['Event Label'].indexOf('- no')>=0);
const CHadInterview = testsOptionC.filter(x=>  x['Event Label'].indexOf('yes_had_interview')>=0);
const CInterviewScheduled = testsOptionC.filter(x=>  x['Event Label'].indexOf('yes_scheduled')>=0);
const CNotInvited = testsOptionC.filter(x=>  x['Event Label'].indexOf('yes_not_invited')>=0);
const CNotInterested = testsOptionC.filter(x=>  x['Event Label'].indexOf('yes_not_interested')>=0);

function reductor(acumulado, item) {
  return acumulado + item;
}


const resultA = statsA.reduce(reductor,0 );
const resultB = statsB.reduce(reductor,0 );
const resultC = statsC.reduce(reductor,0 );


console.log('Total unique answers in Option A =',testsOptionA.length);
console.log('Option A - Response No =',ANo.length);
console.log('Option A - Response Had interview =',AHadInterview.length);
console.log('Option A - Response Interview Scheduled=',AInterviewScheduled.length);
console.log('Option A - Response Not Invited=',ANotInvited.length);
console.log('Option A - Response Not Interested =',ANotInterested.length);

console.log('---------------------------');

console.log('Total unique answers in Option B =',testsOptionB.length);
console.log('Option B - Response No =',BNo.length);
console.log('Option B - Response Had interview =',BHadInterview.length);
console.log('Option B - Response Interview Scheduled=',BInterviewScheduled.length);
console.log('Option B - Response Not Invited=',BNotInvited.length);
console.log('Option B - Response Not Interested =',BNotInterested.length);

console.log('---------------------------');

console.log('Total unique answers in  Option C =',testsOptionC.length);
console.log('Option C - Response No =',CNo.length);
console.log('Option C - Response Had interview =',CHadInterview.length);
console.log('Option C - Response Interview Scheduled=',CInterviewScheduled.length);
console.log('Option C - Response Not Invited=',CNotInvited.length);
console.log('Option C - Response Not Interested =',CNotInterested.length);

console.log('---------------------------');

console.log('Total submittions duplicates for Option A =',resultA);
console.log('Total submittions duplicates for Option B =',resultB);
console.log('Total submittions duplicates for Option C =',resultC);

const VELOCITY_MIN = 5;
const VELOCITY_MAX = 20;
const CFL = 1./16/2.;
const DT = 0.1;
const EPSILON=0.01;
const N = 40;
const EPSILONX = 0.01;
const relaxP = 0.01;
const RHO = (relaxP === 0)?CFL/(DT*DT):Math.min(CFL/DT*DT,1./(2*relaxP));
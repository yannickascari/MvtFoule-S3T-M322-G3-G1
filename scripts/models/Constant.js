const VELOCITY_MIN = 2;
const VELOCITY_MAX = 10;
const CFL = 1./16/2.;
const DT = 0.1;
const EPSILON=0.01;
const EPSILONX = 0.0001;
const relaxP = 0.01;
const RHO = (relaxP === 0)?CFL/(DT*DT):Math.min(CFL/DT*DT,1./(2*relaxP));
const VELOCITY_MIN = 1;
const VELOCITY_MAX = 2;
const CFL = 1./16/2.;
const DT = 0.1;
const EPSILON=1.e-2;
const EPSILONX = 1e-7;
const relaxP = 0.01;
const RHO = (relaxP === 0)?CFL/(DT*DT):Math.min(CFL/DT*DT,1./(2*relaxP));
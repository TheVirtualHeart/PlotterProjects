/**
    * This module is responsible for performing the differential equation
    * calculation for Ohara. The object maintains the state of the different
    * variables and returns them after each calculation. These variables can also
    * be reset. 
*/

define(["utility"],
function OharaCalculator(utils) {
    "use strict";
    
    /**Displays the current iteration of the count */
    var count   =    0, 
    
    /**This refers the functions that will analyze the data that is produced*/          
    analyzers   =    [],   
    settings   =    Object.create(null),
    //  cS is for calculationSettings
    cS,
    //  cC is for constant used in calculations 
    cC; 
    
    /**
        * This function initializes the Calculator. It is functionally the same as
        * the reset function. This wrapper function provides a more semantic way to
        * present that functionality.
        * 
        * @param  {Object} newSettings
    */
    function initialize(newSettings) {               
        settings    =    utils.extend(newSettings);                
    }
    
    /**
        * This function resets the Calculator with the initial values. If any
        * values are specified in newSettings, they will overwrite the existing
        * values in data.calculationSettings.
        * 
        * @param  {Object} newSettings 
    */
    function reset(newSettings) {
        var overwrite   =    newSettings || {};
        for (var attrname in overwrite) { 
            settings.initial[attrname]   =    overwrite[attrname]; 
        };
    }
    
    /**
        * Calculate the locations of the different stimuli according to the S1-S2
        * Protocol.
        * @return {Object} - A JavaScript Object containing an array of s1 values
        * and a single value for s2.
    */
    function _getStimuliLocations(settings) {
        
        var c   =    settings.calculationSettings; // create a shorter reference variables
        
        // store the location of each of the stimuli
        var stimuli     =    {};
        stimuli.s1  =    [];
        for (var i   =    0; i < c.ns1; i++) {
            stimuli.s1.push(i * c.s1 + c.s1Start);
        }
        var lastPeriod  =    c.s1Start + (c.s1 * (c.ns1 - 1));
        stimuli.s2      =    lastPeriod + c.s2;
        
        // return the stimuli
        return stimuli;
    }
    
    /**
        * Performs a differential calculations and increments the values that will
        * be returned by getPoints().
    */
    function calculateNext(data){
        
        var vfrt, Knao, Knai, CaMKb, CaMKa, dCaMKt, ENa, EK, EKs, mss, tm, dm, hss, thf, 
        ths, dhf, dhs, xh, jss, tj, dj, hssp, thsp, dhsp, hp, tjp, djp, fINap,
        mLss, tmL, dmL, hLss, dhL, hLssp, thLp, dhLp, fINaLp, ass, ta, da, iss, 
        delta_epi, tiF, tiS, AiF, AiS, diF, diS, xi, assp, dap, dti_develop, dti_recover, tiFp, 
        tiSp, diFp, diSp, ip, fItop, dss, td, dd, fss, tff, tfs, Aff, Afs, dff, dfs, xf,
        fcass, tfcaf, tfcas, Afcaf, Afcas, dfcaf, dfcas, fca, djca, tffp, dffp, fp, tfcafp,
        dfcafp, fcap, km2n, anca, dnca, PhiCaL, PhiCaNa, PhiCaK, PCap, PCaNa, PCaK, 
        PCaNap, PCaKp, fICaLp, xrss, txrf, txrs, Axrf, Axrs, dxrf, 
        dxrs, xr, rkr, xs1ss, txs1, dxs1, xs2ss, txs2, dxs2, KsCa,
        xk1ss, txk1, dxk1, rk1, hca, hna, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12,
        k1,  k2, k3p, k3pp, k3, k4p, k4pp, k4, k5, k6, k7, k8, x1, x2, x3, x4, E1, E2,
        E3, E4, allo, JncxNa, JncxCa, P, a1, b1, a2, b2, a3, b3, a4, b4, Pnak, xkb,
        GKb, JdiffNa, JdiffK, Jdiff, a_rel, Jrel_inf, tau_rel, 
        dJrelnp, btp, a_relp, Jrel_infp,  tau_relp, dJrelp, fJrelp, Jrel, 
        Jupnp, Jupp, fJupp, Jleak, Jup, Jtr, cmdnmax, dnai, dnass, dki, dkss,
        Bcai, dcai, Bcass, dcass, dcansr, Bcajsr, dcajsr;
        
        var vffrt_t, vfrt_t;
        
        
        // sets current variables after calculations
        data.calculationSettings.currentVariables.forEach(function (item){
            cS[item]  =    data.calculationSettings[item];
        });
        
        
        // sets parameters after calculations
        data.calculationSettings.voltageVariables.forEach(function (item){
            cS[item]  =    data.calculationSettings[item];
        });
        
        // sets additional parameters after calculations
        data.calculationSettings.additionalVariables.forEach(function (item){
            cS[item]  =    data.calculationSettings[item];
        });
        
        //time loop
        
        vffrt_t = cS.v*cS.F*cS.F/(cS.R*cS.T);
        vfrt_t = cS.v*cS.F/(cS.R*cS.T);
        Knao = cS.Knao0*Math.exp(((1.0-cS.delta)*cS.v*cS.F)/(3.0*cS.R*cS.T));
        Knai = cS.Knai0*Math.exp((cS.delta*cS.v*cS.F)/(3.0*cS.R*cS.T));
        
        
        //update CaMK
        CaMKb = cS.CaMKo*(1.0 - cS.camkt)/(1.0+cS.KmCaM/cS.cass);
        CaMKa = CaMKb + cS.camkt;
        dCaMKt = cS.aCaMK*CaMKb*(CaMKb + cS.camkt)-cS.bCaMK*cS.camkt;
        cS.camkt = cS.camkt+cS.timestep*dCaMKt;
        
        //reversal potentials
        ENa = (cS.R*cS.T/cS.F)*Math.log(cS.nao/cS.nai);
        EK  = (cS.R*cS.T/cS.F)*Math.log(cS.ko/cS.ki);
        EKs = (cS.R*cS.T/cS.F)*Math.log((cS.ko+cS.PKNa*cS.nao)/(cS.ki+cS.PKNa*cS.nai));
        
        //calculate INa
        mss = 1.0/(1.0+Math.exp((-(cS.v+39.57))/9.871));
        tm = 1.0/(6.765*Math.exp((cS.v+11.64)/34.77)+8.552*Math.exp(-(cS.v+77.42)/5.955));
        dm = (mss-cS.xm)/tm;
        cS.xm = cS.xm+cS.timestep*dm;
        hss = 1.0/(1+Math.exp((cS.v+82.90)/6.086));
        thf = 1.0/(1.432e-5*Math.exp(-(cS.v+1.196)/6.285)+6.149*Math.exp((cS.v+0.5096)/20.27));
        ths = 1.0/(0.009794*Math.exp(-(cS.v+17.95)/28.05)+0.3343*Math.exp((cS.v+5.730)/56.66));
        dhf = (hss-cS.xhf)/thf;
        dhs = (hss-cS.xhs)/ths;
        cS.xhf = cS.xhf+cS.timestep*dhf;
        cS.xhs = cS.xhs+cS.timestep*dhs;
        xh = cS.Ahf*cS.xhf+cS.Ahs*cS.xhs;
        jss = hss;
        tj = 2.038+1.0/(0.02136*Math.exp(-(cS.v+100.6)/8.281)+0.3052*Math.exp((cS.v+0.9941)/38.45));
        dj = (jss-cS.xj)/tj;
        cS.xj = cS.xj+cS.timestep*dj;
        hssp = 1.0/(1+Math.exp((cS.v+89.1)/6.086));
        thsp = 3.0*ths;
        dhsp = (hssp-cS.xhsp)/thsp;
        cS.xhsp = cS.xhsp+cS.timestep*dhsp;
        hp = cS.Ahf*cS.xhf+cS.Ahs*cS.xhsp;
        tjp = 1.46*tj;
        djp = (jss-cS.xjp)/tjp;
        cS.xjp = cS.xjp+cS.timestep*djp;
        fINap = (1.0/(1.0+cS.KmCaMK/CaMKa));
        cS.ina = cS.GNa*(cS.v-ENa)*cS.xm*cS.xm*cS.xm*((1.0-fINap)*xh*cS.xj+fINap*hp*cS.xjp);
        
        //calculate INaL
        mLss = 1.0/(1.0+Math.exp((-(cS.v+42.85))/5.264));
        tmL = tm;
        dmL = (mLss-cS.xml)/tmL;
        cS.xml = cS.xml+cS.timestep*dmL;
        hLss = 1.0/(1.0+Math.exp((cS.v+87.61)/7.488));
        dhL = (hLss-cS.xhl)/cS.thL;
        cS.xhl = cS.xhl+cS.timestep*dhL;
        hLssp = 1.0/(1.0+Math.exp((cS.v+93.81)/7.488));
        thLp = 3.0*cS.thL;
        dhLp = (hLssp-cS.xhlp)/thLp;
        cS.xhlp = cS.xhlp+cS.timestep*dhLp;
        
        /*if (cS.icelltype === 1){
            cS.GNaL = cS.GNaL*0.6;
        }*/
        fINaLp = (1.0/(1.0+cS.KmCaMK/CaMKa));
        cS.inal = cS.GNaL*(cS.v-ENa)*cS.xml*((1.0-fINaLp)*cS.xhl+fINaLp*cS.xhlp);
        
        
        //calculate Ito
        ass = 1.0/(1.0+Math.exp((-(cS.v-14.34))/14.82));
        ta = 1.0515/(1.0/(1.2089*(1.0+Math.exp(-(cS.v-18.4099)/29.3814)))+3.5/(1.0+Math.exp((cS.v+100.0)/29.3814)));
        da = (ass-cS.xa)/ta;
        cS.xa = cS.xa+cS.timestep*da;
        iss = 1.0/(1.0+Math.exp((cS.v+43.94)/5.711));
        delta_epi = (cS.icelltype === 1)? 1.0-(0.95/(1.0+Math.exp((cS.v+70.0)/5.0))) : 1.0;
        tiF = 4.562+1/(0.3933*Math.exp((-(cS.v+100.0))/100.0)+0.08004*Math.exp((cS.v+50.0)/16.59));
        tiS = 23.62+1/(0.001416*Math.exp((-(cS.v+96.52))/59.05)+1.780e-8*Math.exp((cS.v+114.1)/8.079));
        tiF = tiF*delta_epi;
        tiS = tiS*delta_epi;
        
        AiF = 1.0/(1.0+Math.exp((cS.v-213.6)/151.2));
        AiS = 1.0-AiF,
        diF = (iss-cS.xif)/tiF;
        diS = (iss-cS.xis)/tiS;
        cS.xif = cS.xif+cS.timestep*diF;
        cS.xis = cS.xis+cS.timestep*diS;
        xi = AiF*cS.xif+AiS*cS.xis;
        assp = 1.0/(1.0+Math.exp((-(cS.v-24.34))/14.82));
        dap = (assp-cS.xap)/ta;
        cS.xap = cS.xap+cS.timestep*dap;
        dti_develop = 1.354+1.0e-4/(Math.exp((cS.v-167.4)/15.89)+Math.exp(-(cS.v-12.23)/0.2154));
        dti_recover = 1.0-0.5/(1.0+Math.exp((cS.v+70.0)/20.0));
        tiFp = dti_develop*dti_recover*tiF;
        tiSp = dti_develop*dti_recover*tiS;
        
        diFp = (iss-cS.xifp)/tiFp;
        cS.xifp = cS.xifp+cS.timestep*diFp;
        diSp = (iss-cS.xisp)/tiSp;
        cS.xisp = cS.xisp+cS.timestep*diSp;
        ip = AiF*cS.xifp+AiS*cS.xisp;
       
       /* if((cS.icelltype === 1) || (cS.icelltype === 2)){
            cS.Gto = cS.Gto*4.0;
        } */
        
        fItop = (1.0/(1.0+cS.KmCaMK/CaMKa));
        cS.ito = cS.Gto*(cS.v-EK)*((1.0-fItop)*cS.xa*xi+fItop*cS.xap*ip);
        
        //calculate ICaL, ICaNa, ICaK
        dss = 1.0/(1.0+Math.exp((-(cS.v+3.940))/4.230));
        td = 0.6+1.0/(Math.exp(-0.05*(cS.v+6.0))+Math.exp(0.09*(cS.v+14.0)));
        dd = (dss-cS.xd)/td;
        cS.xd = cS.xd+cS.timestep*dd;
        fss = 1.0/(1.0+Math.exp((cS.v+19.58)/3.696));
        tff = 7.0+1.0/(0.0045*Math.exp(-(cS.v+20.0)/10.0)+0.0045*Math.exp((cS.v+20.0)/10.0));
        tfs = 1000.0+1.0/(0.000035*Math.exp(-(cS.v+5.0)/4.0)+0.000035*Math.exp((cS.v+5.0)/6.0));
        Aff = 0.6;
        Afs = 1.0-Aff,
        dff = (fss-cS.xff)/tff;
        cS.xff = cS.xff+cS.timestep*dff;
        dfs = (fss-cS.xfs)/tfs;
        cS.xfs = cS.xfs+cS.timestep*dfs;
        xf = Aff*cS.xff+Afs*cS.xfs;
        fcass = fss;
        tfcaf = 7.0+1.0/(0.04*Math.exp(-(cS.v-4.0)/7.0)+0.04*Math.exp((cS.v-4.0)/7.0));
        tfcas = 100.0+1.0/(0.00012*Math.exp(-cS.v/3.0)+0.00012*Math.exp(cS.v/7.0));
        Afcaf = 0.3+0.6/(1.0+Math.exp((cS.v-10.0)/10.0));
        Afcas = 1.0-Afcaf;
        dfcaf = (fcass-cS.xfcaf)/tfcaf;
        cS.xfcaf = cS.xfcaf+cS.timestep*dfcaf;
        dfcas = (fcass-cS.xfcas)/tfcas;
        cS.xfcas = cS.xfcas+cS.timestep*dfcas;
        fca = Afcaf*cS.xfcaf+Afcas*cS.xfcas;
        djca = (fcass-cS.xjca)/cS.tjca;
        cS.xjca = cS.xjca+cS.timestep*djca;
        tffp = 2.5*tff;
        dffp = (fss-cS.xffp)/tffp;
        cS.xffp = cS.xffp+cS.timestep*dffp;
        fp = Aff*cS.xffp+Afs*cS.xfs;
        tfcafp = 2.5*tfcaf;
        
        dfcafp = (fcass-cS.xfcafp)/tfcafp;
        cS.xfcafp = cS.xfcafp+cS.timestep*dfcafp;
        fcap = Afcaf*cS.xfcafp+Afcas*cS.xfcas;
        km2n = cS.xjca*1.0,
        anca = 1.0/(cS.k2n/km2n+ Math.pow((1.0+cS.Kmn/cS.cass),4));
        dnca = anca*cS.k2n-cS.xnca*km2n;
        cS.xnca = cS.xnca+cS.timestep*dnca;
        PhiCaL = 4.0*vffrt_t*(cS.cass*Math.exp(2.0*vfrt_t)-0.341*cS.cao)/(Math.exp(2.0*vfrt_t)-1.0);
        PhiCaNa = 1.0*vffrt_t*(0.75*cS.nass*Math.exp(1.0*vfrt_t)-0.75*cS.nao)/(Math.exp(1.0*vfrt_t)-1.0);
        PhiCaK = 1.0*vffrt_t*(0.75*cS.kss*Math.exp(1.0*vfrt_t)-0.75*cS.ko)/(Math.exp(1.0*vfrt_t)-1.0);
            
        /*if(cS.icelltype === 1){
            cS.PCa = cS.PCa*1.2;
        }
        else if (cS.icelltype === 2){
            cS.PCa = cS.PCa*2.5;
        }*/
        PCap = 1.1*cS.PCa;
        PCaNa = 0.00125*cS.PCa;
        PCaK = 3.574e-4*cS.PCa;
        PCaNap = 0.00125*PCap;
        PCaKp = 3.574e-4*PCap;
        fICaLp = (1.0/(1.0+cS.KmCaMK/CaMKa));
        cS.ical  = (1.0-fICaLp)*cS.PCa*PhiCaL*cS.xd*(xf*(1.0-cS.xnca)+cS.xjca*fca*cS.xnca)+fICaLp*PCap*PhiCaL*cS.xd*(fp*(1.0-cS.xnca)+cS.xjca*fcap*cS.xnca);
        cS.icana = (1.0-fICaLp)*PCaNa*PhiCaNa*cS.xd*(xf*(1.0-cS.xnca)+cS.xjca*fca*cS.xnca)+fICaLp*PCaNap*PhiCaNa*cS.xd*(fp*(1.0-cS.xnca)+cS.xjca*fcap*cS.xnca);
        cS.icak  = (1.0-fICaLp)*PCaK*PhiCaK*cS.xd*(xf*(1.0-cS.xnca)+cS.xjca*fca*cS.xnca)+fICaLp*PCaKp*PhiCaK*cS.xd*(fp*(1.0-cS.xnca)+cS.xjca*fcap*cS.xnca);
        
//calculate IKr
        xrss = 1.0/(1.0+Math.exp((-(cS.v+8.337))/6.789));
        txrf = 12.98+1.0/(0.3652*Math.exp((cS.v-31.66)/3.869)+4.123e-5*Math.exp((-(cS.v-47.78))/20.38));
        txrs = 1.865+1.0/(0.06629*Math.exp((cS.v-34.70)/7.355)+1.128e-5*Math.exp((-(cS.v-29.74))/25.94));
        Axrf = 1.0/(1.0+Math.exp((cS.v+54.81)/38.21));
        Axrs = 1.0-Axrf;
        dxrf = (xrss-cS.xrf)/txrf;
        cS.xrf = cS.xrf+cS.timestep*dxrf;
        dxrs = (xrss-cS.xrs)/txrs;
        cS.xrs = cS.xrs+cS.timestep*dxrs;
        xr = Axrf*cS.xrf+Axrs*cS.xrs;
        rkr = 1.0/(1.0+Math.exp((cS.v+55.0)/75.0))*1.0/(1.0+Math.exp((cS.v-10.0)/30.0));
        
        /*if(cS.icelltype === 1){
            cS.GKr = cS.GKr*1.3;
        }
        else if(cS.icelltype === 2){
            cS.GKr = cS.GKr*0.8;
        }*/
        cS.ikr = cS.GKr*Math.sqrt(cS.ko/5.4)*xr*rkr*(cS.v-EK);
        
        // calculate IKs
        xs1ss = 1.0/(1.0+Math.exp((-(cS.v+11.60))/8.932));
        txs1 = 817.3+1.0/(2.326e-4*Math.exp((cS.v+48.28)/17.80)+0.001292*Math.exp((-(cS.v+210.0))/230.0));
        dxs1 = (xs1ss-cS.xs1)/txs1;
        cS.xs1 = cS.xs1+cS.timestep*dxs1;
        xs2ss = xs1ss;
        txs2 = 1.0/(0.01*Math.exp((cS.v-50.0)/20.0)+0.0193*Math.exp((-(cS.v+66.54))/31.0));
        dxs2 = (xs2ss-cS.xs2)/txs2;
        cS.xs2 = cS.xs2+cS.timestep*dxs2;
        KsCa = 1.0+0.6/(1.0+Math.pow((3.8e-5/cS.cai),1.4));   
        
        /*if(cS.icelltype === 1){
            cS.GKs = cS.GKs*1.4;
        }*/
        cS.iks = cS.GKs*KsCa*cS.xs1*cS.xs2*(cS.v-EKs);
        
        //calculate IK1
        xk1ss =  1.0/(1.0+Math.exp(-(cS.v+2.5538*cS.ko+144.59)/(1.5692*cS.ko+3.8115)));
        txk1 = 122.2/(Math.exp((-(cS.v+127.2))/20.36)+Math.exp((cS.v+236.8)/69.33));
        dxk1 = (xk1ss-cS.xk1)/txk1;
        cS.xk1 = cS.xk1+cS.timestep*dxk1;
        rk1 = 1.0/(1.0+Math.exp((cS.v+105.8-2.6*cS.ko)/9.493));
        
        if(cS.icelltype === 1) {
            cS.GK1 = cS.GK1*1.2;
        }
        else if(cS.icelltype === 2){
            cS.GK1 = cS.GK1*1.3;
        }
        cS.ik1 = cS.GK1*Math.sqrt(cS.ko)*rk1*cS.xk1*(cS.v-EK);
                
        //calculate INaCa_i
        hca = Math.exp((cS.qca*cS.v*cS.F)/(cS.R*cS.T));
        hna = Math.exp((cS.qna*cS.v*cS.F)/(cS.R*cS.T));
        h1 = 1+cS.nai/cS.kna3*(1+hna);
        h2 = (cS.nai*hna)/(cS.kna3*h1);
        h3 = 1.0/h1;
        h4 = 1.0+cS.nai/cS.kna1*(1+cS.nai/cS.kna2);
        h5 = cS.nai*cS.nai/(h4*cS.kna1*cS.kna2);
        h6 = 1.0/h4;
        h7 = 1.0+cS.nao/cS.kna3*(1.0+1.0/hna);
        h8 = cS.nao/(cS.kna3*hna*h7);
        h9 = 1.0/h7;
        h10 = cS.kasymm+1.0+cS.nao/cS.kna1*(1.0+cS.nao/cS.kna2);
        h11 = cS.nao*cS.nao/(h10*cS.kna1*cS.kna2);
        h12 = 1.0/h10;
        k1 = h12*cS.cao*cS.kcaon;
        k2 = cS.kcaoff;
        k3p = h9*cS.wca;
        k3pp = h8*cS.wnaca;
        k3 = k3p+k3pp;
        k4p = h3*cS.wca/hca;
        k4pp = h2*cS.wnaca;
        k4 = k4p+k4pp;
        k5 = cS.kcaoff;
        k6 = h6*cS.cai*cS.kcaon;
        k7 = h5*h2*cS.wna;
        k8 = h8*h11*cS.wna;
        x1 = k2*k4*(k7+k6)+k5*k7*(k2+k3);
        x2 = k1*k7*(k4+k5)+k4*k6*(k1+k8);
        x3 = k1*k3*(k7+k6)+k8*k6*(k2+k3);
        x4 = k2*k8*(k4+k5)+k3*k5*(k1+k8);
        E1 = x1/(x1+x2+x3+x4);
        E2 = x2/(x1+x2+x3+x4);
        E3 = x3/(x1+x2+x3+x4);
        E4 = x4/(x1+x2+x3+x4);
        allo = 1.0/(1.0+Math.pow((cS.KmCaAct/cS.cai),2)); 
        JncxNa = 3.0*(E4*k7-E1*k8)+E3*k4pp-E2*k3pp;
        JncxCa = E2*k2-E1*k1;
        /*if(cS.icelltype === 1){
            cS.Gncx = cS.Gncx*1.1;
        }
        else if(icelltype === 2){
            cS.Gncx = cS.Gncx*1.4;
        }*/
        
        cS.inaca_i = 0.8*cS.Gncx*allo*(cS.zna*JncxNa+cS.zca*JncxCa);
        
        //calculate INaCa_ss
        h1 = 1+cS.nass/cS.kna3*(1+hna);
        h2 = (cS.nass*hna)/(cS.kna3*h1);
        h3 = 1.0/h1;
        h4 = 1.0+cS.nass/cS.kna1*(1+cS.nass/cS.kna2);
        h5 = cS.nass*cS.nass/(h4*cS.kna1*cS.kna2);
        h6 = 1.0/h4;
        h7 = 1.0+cS.nao/cS.kna3*(1.0+1.0/hna);
        h8 = cS.nao/(cS.kna3*hna*h7);
        h9 = 1.0/h7;
        h10 = cS.kasymm+1.0+cS.nao/cS.kna1*(1+cS.nao/cS.kna2);
        h11 = cS.nao*cS.nao/(h10*cS.kna1*cS.kna2);
        h12 = 1.0/h10;
        k1 = h12*cS.cao*cS.kcaon;
        k2 = cS.kcaoff;
        k3p = h9*cS.wca;
        k3pp = h8*cS.wnaca;
        k3 = k3p+k3pp;
        k4p = h3*cS.wca/hca;
        k4pp = h2*cS.wnaca;
        k4 = k4p+k4pp;
        k5 = cS.kcaoff;
        k6 = h6*cS.cass*cS.kcaon;
        k7 = h5*h2*cS.wna;
        k8 = h8*h11*cS.wna;
        x1 = k2*k4*(k7+k6)+k5*k7*(k2+k3);
        x2 = k1*k7*(k4+k5)+k4*k6*(k1+k8);
        x3 = k1*k3*(k7+k6)+k8*k6*(k2+k3);
        x4 = k2*k8*(k4+k5)+k3*k5*(k1+k8);
        E1 = x1/(x1+x2+x3+x4);
        E2 = x2/(x1+x2+x3+x4);
        E3 = x3/(x1+x2+x3+x4);
        E4 = x4/(x1+x2+x3+x4);
        allo = 1.0/(1.0+Math.pow((cS.KmCaAct/cS.cass),2));
        JncxNa = 3.0*(E4*k7-E1*k8)+E3*k4pp-E2*k3pp;
        JncxCa = E2*k2-E1*k1;
        cS.inaca_ss = 0.2*cS.Gncx*allo*(cS.zna*JncxNa+cS.zca*JncxCa);
        
        //calculate INaK
        k3p = 1899.0;
        k4p = 639.0;
        P =  cS.eP/(1.0+cS.H/cS.Khp+cS.nai/cS.Knap+cS.ki/cS.Kxkur);
        a1 = (cS.k1p*Math.pow((cS.nai/Knai),3))/(Math.pow((1.0+cS.nai/Knai),3)+Math.pow((1.0+cS.ki/cS.Kki),2)-1.0);
        b1 = cS.k1m*cS.MgADP;
        a2 = cS.k2p;
        b2 = (cS.k2m*Math.pow((cS.nao/Knao),3))/(Math.pow((1.0+cS.nao/Knao),3)+Math.pow((1.0+cS.ko/cS.Kko),2)-1.0);
        a3 = (k3p*Math.pow((cS.ko/cS.Kko),2))/(Math.pow((1.0+cS.nao/Knao),3)+Math.pow((1.0+cS.ko/cS.Kko),2)-1.0);
        b3 = (cS.k3m*P*cS.H)/(1.0+cS.MgATP/cS.Kmgatp);
        a4 = (k4p*cS.MgATP/cS.Kmgatp)/(1.0+cS.MgATP/cS.Kmgatp);
        b4 = (cS.k4m*Math.pow((cS.ki/cS.Kki),2))/(Math.pow((1.0+cS.nai/Knai),3)+Math.pow((1.0+cS.ki/cS.Kki),2)-1.0);
        x1 = a4*a1*a2+b2*b4*b3+a2*b4*b3+b3*a1*a2;
        x2 = b2*b1*b4+a1*a2*a3+a3*b1*b4+a2*a3*b4;
        x3 = a2*a3*a4+b3*b2*b1+b2*b1*a4+a3*a4*b1;
        x4 = b4*b3*b2+a3*a4*a1+b2*a4*a1+b3*b2*a1;
        E1 = x1/(x1+x2+x3+x4);
        E2 = x2/(x1+x2+x3+x4);
        E3 = x3/(x1+x2+x3+x4);
        E4 = x4/(x1+x2+x3+x4);
        cS.jnakna = 3.0*(E1*a3-E2*b3);
        cS.jnakk = 2.0*(E4*b1-E3*a1);
        Pnak = 30.;
        if(cS.icelltype === 1){
            Pnak = Pnak*0.9;
        }   
        else if(cS.icelltype === 2){
            Pnak = Pnak*0.7;
        }
        
        cS.inak = Pnak*(cS.zna*cS.jnakna+cS.zk*cS.jnakk);
        //calculate IKb
        xkb = 1.0/(1.0+Math.exp(-(cS.v-14.48)/18.34));
        GKb = 0.003; 
        if(cS.icelltype === 1){  
            GKb = GKb*0.6;
        }
        cS.ikb = GKb*xkb*(cS.v-EK);
        
        //calculate INab
        cS.inab = cS.PNab*vffrt_t*(cS.nai*Math.exp(vfrt_t)-cS.nao)/(Math.exp(vfrt_t)-1.0);
        
        //calculate ICab
        cS.icab =  cS.PCab*4.0*vffrt_t*(cS.cai*Math.exp(2.0*vfrt_t)-0.341*cS.cao)/(Math.exp(2.0*vfrt_t)-1.0);
        
        //calculate IpCa
        cS.ipca =  cS.GpCa*cS.cai/(0.0005+cS.cai);
        
        cS.istim = _s1s2Stimulus(count, data);
        
        //update the membrane voltage
        //cS.v = cS.v-cS.timestep*(cS.ina+cS.inal+cS.ito+cS.ical+cS.icana+cS.icak+cS.ikr+cS.iks+cS.ik1+cS.inaca_i+cS.inaca_ss+cS.inak+cS.inab+cS.ikb+cS.ipca+cS.icab+cS.istim);

        cS.v = cS.v-cS.timestep*(cS.ina+cS.inal+cS.ito+cS.ical+cS.icana+cS.icak+cS.ikr+cS.iks+cS.ik1+cS.inaca_i+cS.inaca_ss+cS.inak+cS.inab+cS.ikb+cS.ipca+cS.icab+cS.istim);
                        
        //console.log(cS.ina, cS.inal, cS.ito, cS.ical, cS.icana, cS.icak, cS.ikr, cS.iks, cS.ik1, cS.inaca_i, cS.inaca_ss, cS.inak, cS.inab, cS.ikb, cS.ipca, cS.icab, cS.istim);
        
        //calculate diffusion fluxes
        JdiffNa = (cS.nass-cS.nai)/2.0;
        JdiffK = (cS.kss-cS.ki)/2.0;
        Jdiff = (cS.cass-cS.cai)/0.2;
        
        //calculate ryanodione receptor calcium induced calcium release from the jsr
        a_rel = 0.5*cS.bt;
        Jrel_inf = a_rel*(-cS.ical)/(1.0+Math.pow((1.5/cS.cajsr),8));
        if(cS.icelltype === 2){
            Jrel_inf = Jrel_inf*1.7;
        }
        tau_rel = cS.bt/(1.0+0.0123/cS.cajsr);
        
        if (tau_rel === 0.001){
            tau_rel = 0.001;
        }
        
        dJrelnp = (Jrel_inf-cS.jrelnp)/tau_rel;
        cS.jrelnp = cS.jrelnp+cS.timestep*dJrelnp;
        btp = 1.25*cS.bt;
        a_relp = 0.5*btp;
        Jrel_infp = a_relp*(-cS.ical)/(1.0+Math.pow((1.5/cS.cajsr),8)); 
        if(cS.icelltype === 2){
            Jrel_infp = Jrel_infp*1.7;
        }
        tau_relp = btp/(1.0+0.0123/cS.cajsr);
        
        if(tau_relp < 0.001){
            tau_relp = 0.001;
        }
        
        dJrelp = (Jrel_infp-cS.jrelp)/tau_relp;
        cS.jrelp = cS.jrelp+cS.timestep*dJrelp;
        fJrelp = (1.0/(1.0+cS.KmCaMK/CaMKa));
        Jrel = (1.0-fJrelp)*cS.jrelnp+fJrelp*cS.jrelp;
        
        
        //calculate serca pump, ca uptake flux
        Jupnp = 0.004375*cS.cai/(cS.cai+0.00092);
        Jupp = 2.75*0.004375*cS.cai/(cS.cai+0.00092-0.00017);
        if(cS.icelltype === 1){
            Jupnp = Jupnp*1.3;
            Jupp = Jupp*1.3;
        }
        fJupp = (1.0/(1.0+cS.KmCaMK/CaMKa));
        Jleak = 0.0039375*cS.cansr/15.0;
        Jup = (1.0-fJupp)*Jupnp+fJupp*Jupp-Jleak;
        
        //calculate tranlocation flux
        Jtr = (cS.cansr-cS.cajsr)/100.0;
        
        //calcium buffer constants
        cmdnmax = 0.05;
        
        if(cS.icelltype === 1){
            cmdnmax = cmdnmax*1.3;
        }
        
        //update intracellular concentrations, using buffers for cai, cass, cajsr
        dnai = -(cS.ina+cS.inal+3.0*cS.inaca_i+3.0*cS.inak+cS.inab)*cC.Acap/(cS.F*cC.vmyo)+JdiffNa*cC.vss/cC.vmyo ; 
        cS.nai = cS.nai+cS.timestep*dnai;
        dnass = -(cS.icana+3.0*cS.inaca_ss)*cC.Acap/(cS.F*cC.vss)-JdiffNa;
        cS.nass = cS.nass+cS.timestep*dnass;
        
        dki = -(cS.ito+cS.ikr+cS.iks+cS.ik1+cS.ikb+cS.istim-2.0*cS.inak)*cC.Acap/(cS.F*cC.vmyo)+JdiffK*cC.vss/cC.vmyo;
        cS.ki = cS.ki+cS.timestep*dki;
        dkss = -(cS.icak)*cC.Acap/(cS.F*cC.vss)-JdiffK;
        cS.kss = cS.kss+cS.timestep*dkss;
        
        Bcai = 1.0/(1.0+cmdnmax*cS.kmcmdn/Math.pow((cS.kmcmdn+cS.cai),2)+cS.trpnmax*cS.kmtrpn/Math.pow((cS.kmtrpn+cS.cai),2));
        dcai = Bcai*(-(cS.ipca+cS.icab-2.0*cS.inaca_i)*cC.Acap/(2.0*cS.F*cC.vmyo)-Jup*cC.vnsr/cC.vmyo+Jdiff*cC.vss/cC.vmyo);
        cS.cai = cS.cai+cS.timestep*dcai
        
        Bcass = 1.0/(1.0+cS.BSRmax*cS.KmBSR/Math.pow((cS.KmBSR+cS.cass),2)+cS.BSLmax*cS.KmBSL/Math.pow((cS.KmBSL+cS.cass),2));   
        dcass = Bcass*(-(cS.ical-2.0*cS.inaca_ss)*cC.Acap/(2.0*cS.F*cC.vss)+Jrel*cC.vjsr/cC.vss-Jdiff);
        cS.cass = cS.cass+cS.timestep*dcass;
        
        dcansr = Jup-Jtr*cC.vjsr/cC.vnsr;
        cS.cansr = cS.cansr+cS.timestep*dcansr;
        
        Bcajsr = 1.0/(1.0+cS.csqnmax*cS.kmcsqn/Math.pow((cS.kmcsqn+cS.cajsr),2));
        dcajsr = Bcajsr*(Jtr-Jrel);
        cS.cajsr = cS.cajsr+cS.timestep*dcajsr;
        
        //addition for two currents
        cS.inaca = cS.inaca_i + cS.inaca_ss;

        //cal ends
        // sets voltage variables after calculations
        data.calculationSettings.voltageVariables.forEach(function (item){
            data.calculationSettings[item]  =    cS[item];
        });
        
        // sets current variables after calculations
        data.calculationSettings.currentVariables.forEach(function (item){
            data.calculationSettings[item]  =    cS[item];
        });
        
        
        // sets additional variables after calculations
        data.calculationSettings.additionalVariables.forEach(function (item){
            data.calculationSettings[item] = cS[item];
        });
        
        // iterate the count
        count++;
        
        return data;  
        
    }
    
    
    /*
        * This function instantiate an object consisting of constants
        * as properties to be used in calculations iterations. The values 
        * remains unchanged across iterations.
    */
    
    function CalcConstants(c){
        
        this.vcell = 1000*3.14*c.rad*c.rad*c.L,
        this.Ageo = 2*3.14*c.rad*c.rad+2*3.14*c.rad*c.L,
        this.Acap = 2*this.Ageo,
        this.vmyo = 0.68*this.vcell,
        this.vnsr = 0.0552*this.vcell,
        this.vjsr = 0.0048*this.vcell,
        this.vss = 0.02*this.vcell
    }
    
    function _getNumIterations(settings) {
        var c   =    settings.calculationSettings;
        var num   =    (((c.s1 * c.ns1) + c.s2) * 1.1) / c.timestep;
        num   =    Math.floor(num);
        return num;    
    } 
    
    
    function runCalculations(iterations, settings) {
        var state   =   settings,
        curAnalyzer; 
        
        //here 'count' is global variable
        count   =    0;
        

        cS         =   _.cloneDeep(settings.calculationSettings);
        cC         =   new CalcConstants(settings.calculationSettings); 
        /**
            * Reset the calculators to their base states
        */
        var numCalculations = _getNumIterations(settings);  
        for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
            analyzers[curAnalyzer].reset(state);
        }
        
        /**
            * Perform a function before the calculations are run
        */
        for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
            if (analyzers[curAnalyzer].hasOwnProperty("preAggregate")) {
                analyzers[curAnalyzer].preAggregate(state);
            }
        }
        
        /** 
            * Run the calculations the appropriate number of times and 
            * pass these values to the analyzers using their aggregate
            * function
        */        
        for (var i = 0; i < numCalculations; i++) {
            var data = calculateNext(state);         
            for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
                if (analyzers[curAnalyzer].hasOwnProperty("aggregate")) {
                    analyzers[curAnalyzer].aggregate(data);
                }
            }
        }
        
        /**
            * Perform a function after the calculations are run
        */
        for (curAnalyzer = 0; curAnalyzer < analyzers.length; curAnalyzer++) {
            if (analyzers[curAnalyzer].hasOwnProperty("postAggregate")) {
                analyzers[curAnalyzer].postAggregate(data);
            }
        }
        //console.dir(settings);
    } 
    
    /* adding analyzers */
    
    function addAnalysisFunction(fn) {
        analyzers.push(fn);
    }
    
    
    /**
        * This function calculates the stimulus according to the S1-S2 Protocol.
        * The function retrieves the location of the S1-S2 stimuli and then
        * compares the current position against that. If it is within a stimuli
        * location, the stimulus value is returned. Otherwise, 0 is returned.
        * 
        * @param {Number} count - the current position of the calculation. The
        * program checks this against the stimuli locations. If it is within one of
        * these locations, a stimulus is applied.
        * 
        * @return {number} - The stimulus that will be applied.
    */
    function _s1s2Stimulus(count, settings) {
        var stim   =    0;
        var stimuli   =    _getStimuliLocations(settings);
        var c   =    settings.calculationSettings;
        var dur   =    utils.round(c.duration / c.timestep);
        var periods   =    stimuli.s1;
        
        for (var i   =    0; i < periods.length; i++) {
            var periodX   =    utils.round(periods[i] / c.timestep);
            if ((count >=    periodX) && (count < periodX + dur)) {
                stim   =    c.amp;
            }
        }
        var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
        if ((count >=    lastPeriodX) && (count < lastPeriodX + dur)) {
            stim   =    c.amp;
        }   
        return stim;
    }
    
    
    /*
        * This function is responsible for udpating the settings object properties.
        *
    */
    function updateSettingsWithAnalyzers(settings){
        analyzers.forEach(function(analyzer){
            analyzer.getSettings(settings);
        });
    }
    
    /**
        * This is the api that is returned by FoxCalculator. It contains the
        * properties and functions that are accessible from the outside.
    */
    var api   =    {
        addAnalysisFunction: addAnalysisFunction,
        runCalculations: runCalculations,
        timestep: settings.timestep,
        initialize: initialize,            
        calculateNext: calculateNext,
        updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
        reset: reset,
    };
    return api;
    
});
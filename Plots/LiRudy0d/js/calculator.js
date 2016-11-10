/**
    * This module is responsible for performing the differential equation
    * calculation for LiRudyCalculator. The object maintains the state of the different
    * variables and returns them after each calculation. These variables can also
    * be reset. 
*/

define(["utility"],
function LiRudyCalculator(utils) {
    "use strict";
    
    /**Displays the current iteration of the count */
    var count   =    0, 
    
    /**This refers the functions that will analyze the data that is produced*/          
    analyzers   =    [],   
    settings   =    Object.create(null),
    //  cS is for calculationSettings
    cS ,
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
        settings = utils.extend(newSettings);    
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
        
        var ena, ek, eca, icatot, iktot, inatot, icltot, itot, ma, mb, mtau, ha, hb, htau, ja, jb, jtau,
        mltau, hltau, inal2, inal3 ,ml3tau, hl3tau, ireltau, REL, qgap, qdiffna, qgapna, dtau, ftau, f2tau, fcass,
        fcatau,fca2tau,fca2ss, taub, taug, atau, itau, i2tau, xrtau, eks, xs1tau, xs2tau, ytau, iftotal, allo, 
        num, denomterm1,denomterm2, deltaE, inacass, du, POip3, qip3, dqupcamk, dkmplb, qup1, qup2, qtr1, qtr2, 
        bsss,csqn1, bjsr, cjsr, csqn, bcsr, ccsr, dcasss, dcassl, qdiff, dcajsr, dcacsr, dcansr, dnasss, dnassl, 
        dcai, dnai, dki, catotal,cmdn, trpn, bmyo, cmyo, dmyo, caavg, camkbound, camkactive, dvdt, temp1, temp2;
        
        var expmtaut_t, exphtaut_t, expjtaut_t, msst_t, hsst_t, jsst_t, expmltaut_t, expml3taut_t, mlsst_t, ml3sst_t,
        exphltaut_t, exphl3taut_t, hlsst_t, hl3sst_t, jlsst_t, jl3sst_t, dsst_t, expdtaut_t, fsst_t, expftaut_t, 
        f2sst_t, expf2taut_t, bsst_t, gsst_t, exptaubt_t, exptaugt_t, expataut_t, expitaut_t, expi2taut_t, 
        asst_t, isst_t, i2sst_t, asust_t, xrsst_t, expxrtaut_t, rkrt_t, xssst_t, expxs1taut_t, expxs2taut_t, 
        k1sst_t, denommultt_t, expnuvt_t, expnum1vt_t, inakcoefft_t, ysst_t, expytaut_t; 
        
        
         camkbound   = cS.camk0*(1-cS.camktrap)*1/(1+(cS.kmcam/cS.casss));
         camkactive  = camkbound+cS.camktrap;

        ma = 0.64*(cS.v+37.13)/(1-Math.exp(-0.1*(cS.v+37.13)));
        mb = 0.16*Math.exp(-cS.v/11);
        if (cS.v<-40){
            ha = 0.135*Math.exp((70+cS.v)/-6.8);
            hb = 3.56*Math.exp(0.079*cS.v)+310000*Math.exp(0.35*cS.v);
            ja = (-127140*Math.exp(0.2444*cS.v)-0.003474*Math.exp(-0.04391*cS.v))
            *(cS.v+37.78)/(1+Math.exp(0.311*(cS.v+79.23)));
            jb = 0.1212*Math.exp(-0.01052*cS.v)/(1+Math.exp(-0.1378*(cS.v+40.14)));
        }
        else{
            ha = 0.0;
            hb = 1/(0.13*(1+Math.exp((cS.v+10.66)/-11.1)));
            ja = 0.0;
            jb = 0.3*Math.exp(-0.0000002535*cS.v)/(1+Math.exp(-0.1*(cS.v+32)));
        }

        mtau = 1/(ma+mb);
        htau = 1/(ha+hb);
        jtau = 1/(ja+jb);
        msst_t = ma*mtau;
        hsst_t = ha*htau;
        jsst_t = 1*ja*jtau;
        expmtaut_t = Math.exp(-cS.timestep/mtau);
        exphtaut_t = Math.exp(-cS.timestep/htau);
        expjtaut_t = Math.exp(-cS.timestep/jtau);
        
        mltau = 1/(0.64*(cS.v+37.13)/(1-Math.exp(-0.1*(cS.v+37.13))) + 0.16*Math.exp(-cS.v/11));
        ml3tau  = mltau;
        expmltaut_t = Math.exp(-cS.timestep/mltau);
        expml3taut_t = Math.exp(-cS.timestep/ml3tau);
        mlsst_t = 1/(1+Math.exp(-(cS.v+28)/7));
        ml3sst_t   = 1/(1+Math.exp(-(cS.v+63)/7));
        hltau   = 162+132/(1+Math.exp(-(cS.v+28)/5.5));
        hl3tau  = 0.5*hltau;
        exphltaut_t = Math.exp(-cS.timestep/hltau);
        exphl3taut_t = Math.exp(-cS.timestep/hl3tau);
        hlsst_t  = 1/(1+Math.exp((cS.v+28)/12));
        hl3sst_t = 1/(1+Math.exp((cS.v+63)/12));
        jlsst_t  = hlsst_t;
        jl3sst_t = hl3sst_t;
        
        dsst_t = (1/(1.0+Math.exp(-(cS.v-2.0)/7.8)));
        dtau   = (0.59+0.8*Math.exp(0.052*(cS.v+13))/(1+Math.exp(0.132*(cS.v+13))));
        expdtaut_t = Math.exp(-cS.timestep/dtau);
        fsst_t  = 1/(1.0 + Math.exp((cS.v+16.5)/9.5));
        ftau     = 0.92/(0.125*Math.exp(-(0.058*(cS.v-2.5))*(0.045*(cS.v-2.5)))+0.1);
        expftaut_t = Math.exp(-cS.timestep/ftau);
        f2sst_t  = fsst_t;
        f2tau = 0.90/(0.02*Math.exp(-(0.04*(cS.v-18.6))*(0.045*(cS.v-18.6)))+0.005);
        expf2taut_t = Math.exp(-cS.timestep/f2tau);
        
        bsst_t     = 1/(1+ Math.exp (-(cS.v+30)/7));
        gsst_t     = 1/(1+Math.exp((cS.v+61)/5));
        taub = 1/(1.068*Math.exp((cS.v+16.3)/30)+1.068*Math.exp(-(cS.v+16.3)/30));
        exptaubt_t = Math.exp(-cS.timestep/taub);
        taug    = 1/(0.015*Math.exp(-(cS.v+71.7)/83.3)+0.015*Math.exp((cS.v+71.7)/15.4));
        exptaugt_t = Math.exp(-cS.timestep/taug);
        
        atau = 1/(25*Math.exp((cS.v-82)/18)/(1+Math.exp((cS.v-82)/18))+25*Math.exp(-(cS.v+52)/18)/(1+Math.exp(-(cS.v+52)/18)));
        expataut_t = Math.exp(-cS.timestep/atau);
        itau = 2.86+ 1/(Math.exp(-(cS.v+125)/15)*0.1 + 0.1*Math.exp((cS.v+2)/26.5));
        expitaut_t = Math.exp(-cS.timestep/itau);
        i2tau = 21.5+ 1/(Math.exp(-(cS.v+138.2)/52)*0.005 + 0.003*Math.exp((cS.v+18)/12.5));
        expi2taut_t = Math.exp(-cS.timestep/i2tau);
        asst_t     = 1/(1+Math.exp(-(cS.v-8.9)/10.3));
        isst_t     = 1/(1+Math.exp((cS.v+30)/11));
        i2sst_t = isst_t;
        asust_t = 1.0/(1+Math.exp(-(cS.v-3)/19.8));
        
        xrsst_t = 1/(1+Math.exp(-(cS.v)/15));
        xrtau   = 400.0/(1.0+Math.exp(cS.v/10.0)) + 100.0;
        expxrtaut_t = Math.exp(-cS.timestep/xrtau);
        rkrt_t     = 1/(1+Math.exp((cS.v)/35));
        
        xssst_t = 1/(1+Math.exp(-(cS.v-9)/13.7));
        xs1tau = 200/(Math.exp(-(cS.v+10)/6) + Math.exp((cS.v-62)/55));
        xs2tau = 1500+ 350/(Math.exp(-(cS.v+10)/4) + Math.exp((cS.v-90)/58));
        expxs1taut_t = Math.exp(-cS.timestep/xs1tau);
        expxs2taut_t = Math.exp(-cS.timestep/xs2tau);
        
        k1sst_t = 1/(1+Math.exp((cS.v+103-(2.9+cS.ko*2.175))/10.15));
        
        denommultt_t = 1+cS.ksat*Math.exp((cS.nu-1)*cS.v*cC.fort);
        
        expnuvt_t = Math.exp(cS.nu*cS.v*cC.fort);
        expnum1vt_t = Math.exp((cS.nu-1)*cS.v*cC.fort);
        
        inakcoefft_t = cS.ibarnak*(1/(1+Math.exp(-1*(cS.v+92)*cC.fort)))*(cS.ko/(cS.ko+0.8));
        
        ysst_t = 1/(1+Math.exp((cS.v+87)/9.5));
        ytau = 2000/(Math.exp(-(cS.v+132)/10) + Math.exp((cS.v+57)/60));
        expytaut_t = Math.exp(-cS.timestep/ytau);
        
        //void comp_revs ()
        eca = 0.5*cC.rtof*Math.log(cS.cao/cS.cassl);
        ena = cC.rtof*Math.log(cS.nao/cS.nassl);
        ek = cC.rtof*Math.log(cS.ko/cS.ki);
        
        //void comp_ina ()        
        cS.m = msst_t-(msst_t-cS.m)*expmtaut_t;
        cS.h = hsst_t-(hsst_t-cS.h)*exphtaut_t;
        cS.j = jsst_t-(jsst_t-cS.j)*expjtaut_t;
        cS.ina = cS.gna*cS.m*cS.m*cS.m*cS.h*cS.j*(cS.v-ena);
        
        //void comp_inal ()        
        cS.ml    = mlsst_t-(mlsst_t-cS.ml)*expmltaut_t;
        cS.ml3   = ml3sst_t-(ml3sst_t-cS.ml3)*expml3taut_t;
        cS.hl    = hlsst_t-(hlsst_t-cS.hl)*exphltaut_t;
        cS.hl3   = hl3sst_t-(hl3sst_t-cS.hl3)*exphl3taut_t;
        cS.jl    = jlsst_t-(jlsst_t-cS.jl)*cC.expjltau;
        cS.jl3   = jl3sst_t-(jl3sst_t-cS.jl3)*cC.expjl3tau;
        inal2    = cS.gnal2*cS.ml*cS.hl*cS.jl*(cS.v-ena);
        inal3    = cS.gnal3*cS.ml3*cS.hl3*cS.jl3*(cS.v-ena);
        cS.inal  = inal2 + inal3; 
        
        //void comp_inab ()
        temp1 = Math.exp(cC.fort*cS.v);
        cS.inab    = cS.pnab*(cC.f2ort*cS.v)*(cS.nassl*temp1 - cS.nao)/(temp1-1);
        
        //void comp_ical ()
        temp1=Math.exp((cS.zca*(cS.v-15)*cC.fort));
        cS.ibarca  = cC.pcazca2*(((cS.v-15)*cC.f2ort))*((cS.gacai*cS.casss*temp1-cC.gacaocao)/(temp1-1));
        fcass  = 0.3/(1 - cS.ical/0.05) + 0.55/(1.0+cS.casss/0.003)+0.15;
        fcatau  = 10*camkactive/(camkactive+cS.kmcam) + 0.5+1/(1.0+cS.casss/0.003);
        fca2ss  = 1.0/(1.0-cS.ical/0.01);
        fca2tau  = 1*(300.0/(1.0+Math.exp((-cS.ical-0.175)/0.04))+125.0);
        cS.d      = dsst_t-(dsst_t-cS.d)*expdtaut_t;
        cS.f      = fsst_t-(fsst_t-cS.f)*expftaut_t;
        cS.f2      = f2sst_t-(f2sst_t-cS.f2)*expf2taut_t;
        cS.fca      = fcass-(fcass-cS.fca)*Math.exp(-cS.timestep/fcatau);
        cS.fca2  = fca2ss-(fca2ss-cS.fca2)*Math.exp(-cS.timestep/fca2tau);
        cS.ical  = cS.d*cS.f*cS.f2*cS.fca*cS.fca2*cS.ibarca; 
       

        //void comp_icat ()
        cS.b     = bsst_t-(bsst_t-cS.b)*exptaubt_t;
        cS.g     = gsst_t-(gsst_t-cS.g)*exptaugt_t;
        cS.icat = cS.gcat*cS.b*cS.g*(cS.v-eca);
        
        //void comp_icab ()
        temp1 = Math.exp((cS.zca*cS.v*cC.fort));
        cS.icab = cC.pcabzca2*((cS.v*cC.f2ort))*((cS.gacai*cS.cassl*temp1-cC.gacaocao)/(temp1-1));
        
        //void comp_ito1 ()
        cS.a     = asst_t-(asst_t-cS.a)*expataut_t;
        cS.i     = isst_t-(isst_t-cS.i)*expitaut_t;
        cS.i2     = i2sst_t-(i2sst_t-cS.i2)*expi2taut_t;
        cS.itos    = cS.gtos*cS.a*cS.i*cS.i2*(cS.v-ek);
        // cS.itof    = gtof*(cS.v-ek)/(1+Math.exp(-(cS.v-3)/19.8));
        cS.itof    = cS.gtof*(cS.v-ek)*asust_t;
        cS.ito1 = cS.itos + cS.itof;
        
        //void comp_ikr ()
        cS.xr     = xrsst_t-(xrsst_t-cS.xr)*expxrtaut_t;
        cS.ikr     = cS.gkr*cS.xr*rkrt_t*(cS.v-ek); 
        
        //void comp_iks ()
        eks     = cC.rtof*Math.log((cS.ko+cS.prnak*cS.nao)/(cS.ki+cS.prnak*cS.nassl));
        //cS.gks     = 0.053*(1+0.6/(1+Math.pow((0.000038/cS.cassl),1.4)));
        cS.xs1     = xssst_t-(xssst_t-cS.xs1)*expxs1taut_t;
        cS.xs2     = xssst_t-(xssst_t-cS.xs2)*expxs2taut_t;
        cS.iks     = cS.gks*cS.xs1*cS.xs2*(cS.v-eks);
        
        //void comp_ik1 ()
        cS.ik1  = cS.gk1*k1sst_t*(cS.v-ek);    
        
        //void comp_inaca ()
        allo  = 1/(1+Math.pow((cS.kmcaact/(1.5*cS.casss)),2));
        num      = cS.inacamax*(Math.pow(cS.nasss,3)*cS.cao*Math.exp(cS.nu*cS.v*cC.fort)-cC.nao3*1.5*cS.casss*Math.exp((cS.nu-1)*cS.v*cC.fort));
        denomterm1 = cS.kmcao*Math.pow(cS.nasss,3)+cC.kmnao3*1.5*cS.casss+cC.kmnai13*cS.cao*(1+1.5*cS.casss/cS.kmcai);
        denomterm2 = cS.kmcai*cC.nao3*(1+Math.pow(cS.nasss/cS.kmnai1,3))+Math.pow(cS.nasss,3)*cS.cao+cC.nao3*1.5*cS.casss;
        deltaE  = num/(denommultt_t*(denomterm1+denomterm2));
        inacass  = 0.2*allo*deltaE;
        
        allo  = 1/(1+Math.pow((cS.kmcaact/(1.5*cS.cassl)),2));
        num      = cS.inacamax*(Math.pow(cS.nassl,3)*cS.cao*expnuvt_t-cC.nao3*1.5*cS.cassl*expnum1vt_t);
        denomterm1 = cS.kmcao*Math.pow(cS.nassl,3)+cC.kmnao3*1.5*cS.cassl+cC.kmnai13*cS.cao*(1+1.5*cS.cassl/cS.kmcai);
        denomterm2 = cS.kmcai*cC.nao3*(1+Math.pow(cS.nassl/cS.kmnai1,3))+Math.pow(cS.nassl,3)*cS.cao+cC.nao3*1.5*cS.cassl;
        deltaE  = num/(denommultt_t*(denomterm1+denomterm2));
        cS.inaca  = 0.8*allo*deltaE;
        
        //void comp_inak ()
        cS.inak = inakcoefft_t*Math.pow((cS.nassl/(cS.nassl+2.6)),3);
        
        //void comp_ipca ()
        cS.ipca = cS.ipcabar/((cS.kmpca/cS.cassl)+1);
        
        //void comp_if ()
        cS.y   = ysst_t - (ysst_t-cS.y)*expytaut_t;
        cS.ifna   = 0.012*cS.y*cS.y*(cS.v-ena);
        cS.ifk = 0.024*cS.y*cS.y*(cS.v-ek);
        iftotal   = cS.ifna + cS.ifk;
        
       
        cS.istim = _s1s2Stimulus(count, data);

        icatot = cS.ical+cS.icat+cS.ipca+cS.icab-2*cS.inaca-2*inacass;
        iktot = cS.ikr+cS.iks+cS.ik1-2*cS.inak+cS.ito1+cS.ifk+1*cS.istim;
        inatot = 3*cS.inak+cS.ina+3*cS.inaca+3*inacass+cS.inal+cS.ifna+cS.inab;
        itot = icatot+iktot+inatot;       
        
        //void comp_ip3 ()
        du= cS.timestep*(cS.casss*cS.k2*(1-cS.u) - cS.k2a*cS.u);
        cS.u += du;
        POip3 = cC.tauip3rIP3*cS.casss*(1-cS.u)/((1+cC.IP3k0_k0a)*(1+cS.casss*cC.k1_k1a));
        qip3 = 10.920*(cS.cajsr-cS.casss)*(POip3);
        
        //void comp_qrel1 ()
        qdiff  = (cS.casss-cS.cassl)*cC.osstau;  
        REL  = -((cS.ical)*cC.acap_2fvsss - (cS.qrel1 + qip3)*cC.vjsr_vsss + qdiff);     
        temp1=0.28/camkactive;
        temp1=temp1*temp1;
        temp1=temp1*temp1;
        temp1=temp1*temp1;
        temp2=1.0/cS.cajsr;
        temp2=temp2*temp2;
        temp2=temp2*temp2;
        temp2=temp2*temp2;
        ireltau = 2*(1+1*(1/(1+temp1)))/(1+(0.0123/cS.cajsr));
        if (REL > 0)
        {cS.irelss  = 15*(1+1*(1/(1+temp1)))*REL/(1 + temp2);}
        else {cS.irelss = 0;}
        cS.qrel1 += cS.timestep*((cS.irelss-cS.qrel1)/ireltau);
        
        //void comp_qrel2 ()
        temp2=1.0/cS.cacsr;
        temp2=temp2*temp2;
        temp2=temp2*temp2;
        temp2=temp2*temp2;
        qgap  = (cS.cassl-cS.cai)*cC.ogaptau;  
        REL  = (-qup2*cC.vnsr_vmyo + qgap*cC.vssl_vmyo+ (cS.qrel2)*cC.vcsr_vmyo);    
        ireltau = 6*(1+1*(1/(1+temp1)))/(1+(0.0123/cS.cacsr));
        if (REL > 0)
        {cS.irelss  = 91*(1+1*(1/(1+temp1)))*(REL)/(1 + temp2);}
        else {cS.irelss = 0;}
        cS.qrel2 += cS.timestep*((cS.irelss-cS.qrel2)/ireltau);
        
        //void comp_qup1 ()
        dkmplb  = cS.dkmplbbar*camkactive/(cS.kmcamk+camkactive);
        dqupcamk = cS.dqupcamkbar*camkactive/(cS.kmcamk+camkactive); 
        qup1  = 0.0002*(dqupcamk+1)/(1+((cS.kmup-dkmplb)/cS.cassl))-0.00105*cS.cansr*cC.onsrbar;
        
        //void comp_qup2 ()
        dkmplb  = cS.dkmplbbar*camkactive/(cS.kmcamk+camkactive);
        dqupcamk = cS.dqupcamkbar*camkactive/(cS.kmcamk+camkactive); 
        qup2  = 0.0026*(dqupcamk+1)/(1+((cS.kmup-dkmplb)/cS.cai))-0.0042*cS.cansr*cC.onsrbar;
        
        //void comp_qtr1 ()
        qtr1  = (cS.cansr-cS.cajsr)*cC.otautr1;
        
        //void comp_qtr2 ()
        qtr2  = (cS.cansr-cS.cacsr)*cC.otautr2;
        
        //void comp_conc ()
        qdiff = (cS.casss-cS.cassl)*cC.osstau;  
        qgap  = (cS.cassl-cS.cai)*cC.ogaptau;  
        qdiffna     = (cS.nasss-cS.nassl)*cC.osstau;
        qgapna = (cS.nassl-cS.nai)*cC.ogaptau;
        
        dcasss  = cS.timestep*(-(cS.ical-2*inacass)*cC.acap_2fvsss+(cS.qrel1+qip3)*cC.vjsr_vsss-qdiff);
        bsss  = 1/(1+(cS.bsrbar*cS.kmbsr/Math.pow(cS.kmbsr+cS.casss,2))+(cS.bslbar*cS.kmbsl/Math.pow(cS.kmbsl+cS.casss,2)));
        cS.casss += bsss*dcasss;
        
        dcassl  = cS.timestep*(-(qup1)*cC.vnsr_vssl+qdiff*cC.vsss_vssl-qgap-(cS.icat+cS.ipca+cS.icab-2*cS.inaca)*cC.acap_2fvssl);
        trpn  = cS.trpnbar1*(cS.cassl/(cS.cassl+cS.kmtrpn));
        cmdn  = cS.cmdnbar1*(cS.cassl/(cS.cassl+cS.kmcmdn));
        catotal  = trpn+cmdn+dcassl+cS.cassl;
        bmyo  = cS.cmdnbar1+cS.trpnbar1-catotal+cS.kmtrpn+cS.kmcmdn;
        cmyo  = cS.kmcmdn*cS.kmtrpn-catotal*(cS.kmtrpn+cS.kmcmdn)+(cS.trpnbar1*cS.kmcmdn)+cS.cmdnbar1*cS.kmtrpn;
        dmyo  = -cS.kmtrpn*cS.kmcmdn*catotal;
        cS.cassl  = (2.0/3.0)*Math.sqrt(bmyo*bmyo-3.0*cmyo)*Math.cos(Math.acos((9.0*bmyo*cmyo-2*bmyo*bmyo*bmyo-27*dmyo)/(2.0*Math.pow((bmyo*bmyo-3.0*cmyo),1.5)))/3.0)-bmyo/3.0;   
        
        dcajsr  = cS.timestep*(qtr1-cS.qrel1-qip3);
        csqn1 = cS.csqnbar1*(cS.cajsr/(cS.cajsr+cS.kmcsqn));
        bjsr  = cS.csqnbar1 - csqn1-cS.cajsr-dcajsr+cS.kmcsqn;
        cjsr  = cS.kmcsqn*(csqn1+cS.cajsr+dcajsr);
        cS.cajsr = (Math.sqrt(bjsr*bjsr+4*cjsr)-bjsr)/2;
        
        dcacsr  = cS.timestep*(qtr2-cS.qrel2);
        csqn  = cS.csqnbar*(cS.cacsr/(cS.cacsr+cS.kmcsqn));
        bcsr  = cS.csqnbar - csqn-cS.cacsr-dcacsr+cS.kmcsqn;
        ccsr  = cS.kmcsqn*(csqn+cS.cacsr+dcacsr);
        cS.cacsr = (Math.sqrt(bcsr*bcsr+4*ccsr)-bcsr)/2;
        
        dcansr     = cS.timestep*(qup1+qup2-qtr1*cC.vjsr_vnsr-qtr2*cC.vcsr_vnsr);
        cS.cansr    += dcansr;
        
        dnasss     = cS.timestep*((-(3*inacass)*cC.acap_fvsss)-qdiffna); 
        cS.nasss += dnasss;
        
        dnassl     = cS.timestep*((-(3*cS.inak+cS.ina+cS.inal+3*cS.inaca+cS.ifna+cS.inab)*cC.acap_fvssl)+qdiffna*cC.vsss_vssl-qgapna);
        cS.nassl    += dnassl;
        
        dnai  = cS.timestep*(qgapna*cC.vssl_vmyo);
        cS.nai  += dnai;
        
        dki   = cS.timestep*((-iktot*cC.kiconst));
        cS.ki   += dki;
        
        dcai  = cS.timestep*(-(qup2)*cC.vnsr_vmyo+qgap*cC.vssl_vmyo+(cS.qrel2)*cC.vcsr_vmyo);
        trpn  = cS.trpnbar*(cS.cai/(cS.cai+cS.kmtrpn));
        cmdn  = cS.cmdnbar*(cS.cai/(cS.cai+cS.kmcmdn));
        catotal  = trpn+cmdn+dcai+cS.cai;
        bmyo  = cS.cmdnbar+cS.trpnbar-catotal+cS.kmtrpn+cS.kmcmdn;
        cmyo  = cS.kmcmdn*cS.kmtrpn-catotal*(cS.kmtrpn+cS.kmcmdn)+(cS.trpnbar*cS.kmcmdn)+cS.cmdnbar*cS.kmtrpn;
        dmyo  = -cS.kmtrpn*cS.kmcmdn*catotal;
        cS.cai      = (2.0/3.0)*Math.sqrt(bmyo*bmyo-3.0*cmyo)*Math.cos(Math.acos((9.0*bmyo*cmyo-2*bmyo*bmyo*bmyo-27*dmyo)/(2.0*Math.pow((bmyo*bmyo-3.0*cmyo),1.5)))/3.0)-bmyo/3.0;  
        
        caavg = (cS.casss*cC.vsss+cS.cassl*cC.vssl+cS.cai*cC.vmyo)/(cC.vsss+cC.vmyo+cC.vssl);
        
        camkbound = cS.camk0*(1-cS.camktrap)*1/(1+(cS.kmcam/cS.casss));
        cS.camktrap = cS.timestep*(cS.alphacamk*camkbound*(camkbound+cS.camktrap)-cS.betacamk*cS.camktrap) + cS.camktrap;
        camkactive = camkbound+cS.camktrap; 
        
        //update v  
        dvdt = -itot;
        cS.v    += dvdt*cS.timestep;
        
        
        //cal ends
        // sets voltage variables after calculations
        utils.copySpecific(data.calculationSettings, cS,  data.calculationSettings.voltageVariables);
        
        // sets current variables after calculations
        utils.copySpecific(data.calculationSettings, cS, data.calculationSettings.currentVariables);
        
        
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
        // CELL GEOMETRY
        this.vcell = 1000*c.pi*c.radius*c.radius*c.length;
        this.ageo = 2*c.pi*c.radius*c.radius + 2*c.pi*c.radius*c.length;
        this.acap = c.rcg*this.ageo;
        this.vmyo = this.vcell * 0.60;
        this.vnsr = this.vcell * 0.04;
        this.vmito = this.vcell * 0.18;
        this.vjsr = this.vcell * 0.002;
        this.vcsr = this.vcell * 0.008;
        this.vsss = this.vcell * 0.02;
        this.vssl = this.vcell * 0.15;
        
        //set up combinations of constants
        this.rtof = c.R*c.temp/c.frdy;
        this.fort = 1.0/this.rtof;
        this.f2ort= c.frdy*this.fort;
        this.jltau   = 411;
        this.jl3tau  = 0.5*this.jltau;
        this.expjl3tau = Math.exp(-c.timestep/this.jl3tau);
        this.expjltau = Math.exp(-c.timestep/this.jltau);
        this.pcazca2 = c.pca*c.zca*c.zca;
        this.gacaocao = c.gacao*c.cao;
        this.pcabzca2 = c.pcab*c.zca*c.zca;
        this.nao3 = c.nao*c.nao*c.nao;
        this.kmnao3 = c.kmnao*c.kmnao*c.kmnao;
        this.kmnai13 = c.kmnai1*c.kmnai1*c.kmnai1;
        this.tauip3rIP3 = c.tauip3r*c.IP3;
        this.IP3k0_k0a = c.IP3*c.k0/c.k0a;
        this.k1_k1a = c.k1/c.k1a;
        this.osstau = 1.0/c.sstau;
        this.acap_2fvsss = this.acap / (this.vsss*2.0*c.frdy);
        this.vjsr_vsss = this.vjsr/this.vsss;
        this.ogaptau = 1.0/c.gaptau;
        this.vnsr_vmyo = this.vnsr/this.vmyo;
        this.vssl_vmyo = this.vssl/this.vmyo;
        this.vcsr_vmyo = this.vcsr/this.vmyo;
        this.onsrbar = 1.0/c.nsrbar;
        this.otautr1 = 1.0/c.tautr1;
        this.otautr2 = 1.0/c.tautr2;
        this.vnsr_vssl = this.vnsr/this.vssl;
        this.vsss_vssl = this.vsss/this.vssl;
        this.acap_2fvssl = this.acap/(this.vssl*2.0*c.frdy);
        this.vjsr_vnsr = this.vjsr/this.vnsr;
        this.vcsr_vnsr = this.vcsr/this.vnsr;
        this.acap_fvsss = this.acap/(this.vsss*c.frdy);
        this.acap_fvssl = this.acap/(this.vssl*c.frdy);
        this.kiconst = this.acap/((this.vmyo+this.vssl+this.vsss)*c.zk*c.frdy);
    }
    
    
    function _getNumIterations(settings) {
        var c   =    settings.calculationSettings;
        var num = ((c.s1 * (c.ns1 - 1)) + (2 * c.s2)) / c.timestep;
        num   =    Math.floor(num);
        return num;    
    } 
    
    
    function runCalculations(iterations, settings) {
        var state   =   settings,
        curAnalyzer; 
        
        //here 'count' is global variable
        count   =    0;
        
        cS =   _.cloneDeep(settings.calculationSettings);      
        cC =   new CalcConstants(settings.calculationSettings); 
        
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
                    if(   (analyzers[curAnalyzer].analyzerName === "PointBufferAnalyzer" || analyzers[curAnalyzer].analyzerName === "APDAnalyzer") 
                    || (analyzers[curAnalyzer].analyzerName === "S1S2Analyzer" && i >= numCalculations-2)){
                        analyzers[curAnalyzer].aggregate(data);
                    }         
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
        var dur   =    utils.round(c.stimdur / c.timestep);
        var periods   =    stimuli.s1;
        
        for (var i   =    0; i < periods.length; i++) {
            var periodX   =    utils.round(periods[i] / c.timestep);
            if ((count >=    periodX) && (count < periodX + dur)) {
                stim   =    c.istim;
            }
        }
        var lastPeriodX   =    utils.round(stimuli.s2 / c.timestep);
        if ((count >=    lastPeriodX) && (count < lastPeriodX + dur)) {
            stim   =    c.istim;
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
        initialize: initialize,            
        updateSettingsWithAnalyzers : updateSettingsWithAnalyzers,
        reset: reset,
    };
    return api;
});
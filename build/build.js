var gurt = 5.773;
var höhe = 5.00;
var scala = 20;
var Emodul = 210;
var SigmaK = -313;
var Nk = 2837;
var SigmaF = 355;
var Force;
var Forces = [];
var iForces = [];
var Bruch;
function Arco(P1, P2, stoW, v1, v2, v3) {
    var P3;
    var P4;
    var Z;
    var AlfaP1;
    var AlfaP2;
    var AlfaInt;
    var r;
    var delta;
    var Sehne;
    P3 = { x: (P2.x + P1.x) / 2, y: (P2.y + P1.y) / 2 };
    Sehne = Math.sqrt((P2.x - P1.x) * (P2.x - P1.x) + (P2.y - P1.y) * (P2.y - P1.y));
    delta = 0.25 * Sehne;
    r = 2.5 * delta;
    Z = { x: P3.x + 1.5 * delta * (P1.y - P2.y) / Sehne, y: P3.y + 1.5 * delta * (P2.x - P1.x) / Sehne };
    AlfaInt = acos(1.5 * delta / r);
    AlfaP1 = asin((Z.y - P1.y) / r);
    AlfaP2 = asin((P2.x - Z.x) / r) + 90;
    strokeWeight(stoW);
    stroke(v1, v2, v3);
    noFill();
    for (var i = 0; i < (2 * AlfaInt); i++) {
        P4 = { x: r * cos(i + AlfaP1 + 180) + Z.x, y: r * sin(i + AlfaP1 + 180) + Z.y };
        point(P4.x, P4.y);
    }
}
function AusKnicken(P1, P2, Hor) {
    strokeWeight(3);
    if (Hor) {
        line(P1.x, P1.y, (P2.x + P1.x) / 2, (P2.y + P1.y) / 2 - 30);
        line((P1.x + P2.x) / 2, (P2.y + P1.y) / 2 - 30, P2.x, P2.y);
    }
    else if (P1.y < P2.y) {
        line(P1.x, P1.y, P1.x, (P1.y + P2.y) / 2);
        line(P1.x, (P2.y + P1.y) / 2, P2.x, P2.y);
    }
    else {
        line(P2.x, P2.y, P2.x, (P1.y + P2.y) / 2);
        line(P2.x, (P1.y + P2.y) / 2, P1.x, P1.y);
    }
    ;
}
function Fliessen(P1, P2) {
    strokeWeight(1);
    line(P1.x, P1.y, P2.x, P2.y);
    strokeWeight(2);
    line(P1.x, P1.y, (P2.x + 2 * P1.x) / 3, (P2.y + 2 * P1.y) / 3);
    line(P2.x, P2.y, (2 * P2.x + P1.x) / 3, (2 * P2.y + P1.y) / 3);
}
function Crash(startX, startY, Sigma) {
    if (Sigma > 0)
        stroke(234, 35, 35);
    else
        stroke(21, 233, 216);
    line(startX - 7, startY - 7, startX + 7, startY + 7);
    line(startX + 7, startY - 7, startX - 7, startY + 7);
    stroke(255, 255, 255);
}
function LastPfeile(startX, startY, hor, vert) {
    stroke(255, 255, 255);
    strokeWeight(1);
    if ((vert) > 0) {
        triangle(startX, startY, startX + 5, startY - 10, startX - 5, startY - 10);
        line(startX, startY, startX, startY - 60);
        text(nfs(vert, 1, 3), startX, startY - 60);
    }
    ;
    if ((vert) < 0) {
        triangle(startX, startY, startX + 5, startY + 10, startX - 5, startY + 10);
        line(startX, startY, startX, startY + 60);
        text(nfs(vert, 1, 3), startX, startY + 60);
    }
    ;
    if ((hor) > 0) {
        triangle(startX, startY, startX - 10, startY - 5, startX - 10, startY + 5);
        line(startX, startY, startX - 60, startY);
        text(nfs(hor, 1, 3), startX - 60, startY);
    }
    ;
    if ((hor) < 0) {
        triangle(startX, startY, startX + 10, startY - 5, startX + 10, startY + 5);
        line(startX, startY, startX + 60, startY);
        text(nfs(hor, 1, 3), startX + 60, startY);
    }
    ;
}
;
var TuttiFrutti = (function () {
    function TuttiFrutti(startX, startY, AForces) {
        if (AForces === void 0) { AForces = []; }
        this.UGurten = [];
        this.OGurten = [];
        this.Streben = [];
        this.BForces = [];
        this.Punti = [];
        this.PuntiC = [];
        this.Oelement = [];
        this.Selement = [];
        this.Uelement = [];
        this.colors = [];
        this.Colori = [];
        this.Defor = [];
        this.startX = startX;
        this.startY = startY;
        var AH = 0;
        var MBV = 0;
        var MAV = 0;
        var AUXMOM = 0;
        var SUMV = 0;
        var SUMH = 0;
        var dummy = 0;
        var grad = Math.PI / 180;
        for (var i = 0; i < AForces.length; i++) {
            this.BForces[i] = AForces[i];
        }
        for (var i = 0; i < 11; i++) {
            if (i / 2 === int(i / 2))
                this.Punti[i] = { x: startX + i * scala * gurt / 2, y: startY - 300 };
            else
                this.Punti[i] = { x: startX + i * scala * gurt / 2, y: startY - 300 - scala * höhe };
        }
        ;
        for (var i = 0; i < 9; i++) {
            MBV = MBV - AForces[i].v * (9 - i) * gurt / 2;
            AH = AH + AForces[i].h;
            if (i / 2 === int(i / 2))
                MBV = MBV + AForces[i].h * höhe;
        }
        dummy = MBV / (5 * gurt);
        this.A = { AK: { h: -AH, v: dummy }, P: { x: startX, y: startY }, pd: { x: startX, y: startY }, AKi: { h: null, v: null } };
        for (var i = 0; i < 9; i++) {
            MAV = MAV + AForces[i].v * (i + 1) * gurt / 2;
            if (i / 2 === int(i / 2))
                MAV = MAV + AForces[i].h * höhe;
        }
        dummy = -MAV / (5 * gurt);
        this.B = { AK: { h: 0, v: dummy }, P: { x: startX + 5 * gurt, y: startY }, pd: { x: startX + 5 * gurt * scala, y: startY }, AKi: { h: null, v: null } };
        for (var i = 0; i < 10; i++) {
            if (i / 2 === int(i / 2)) {
                this.Streben[i] = { P1: { x: startX + i * gurt / 2, y: startY + 0 }, P2: { x: startX + (i + 1) * gurt / 2, y: startY - höhe }, L: gurt, K: null, Aera: 9050, Sigma: null,
                    pd1: { x: startX + i * gurt * scala / 2, y: startY + 0 }, pd2: { x: startX + (i + 1) * gurt * scala / 2, y: startY - höhe * scala }, Ki: null, buckling: false, yield: false };
            }
            else {
                this.Streben[i] = { P1: { x: startX + i * gurt / 2, y: startY - höhe }, P2: { x: startX + i * gurt / 2 + gurt / 2, y: startY }, L: gurt, K: null, Aera: 9050, Sigma: null,
                    pd1: { x: startX + i * gurt * scala / 2, y: startY - höhe * scala }, pd2: { x: startX + i * gurt * scala / 2 + gurt * scala / 2, y: startY }, Ki: null, buckling: false, yield: false };
            }
            ;
        }
        ;
        for (var i = 0; i < 4; i++) {
            this.OGurten[i] = { P1: { x: startX + i * gurt + gurt / 2, y: startY - höhe }, P2: { x: startX + (i + 1) * gurt + gurt / 2, y: startY - höhe }, L: gurt, K: null, Aera: 9050, Sigma: null,
                pd1: { x: startX + i * gurt * scala + gurt * scala / 2, y: startY - höhe * scala }, pd2: { x: startX + (i + 1) * gurt * scala + gurt * scala / 2, y: startY - höhe * scala }, Ki: null, buckling: false, yield: false };
        }
        ;
        for (var i = 0; i < 5; i++) {
            this.UGurten[i] = { P1: { x: startX + i * gurt, y: startY }, P2: { x: startX + (i + 1) * gurt, y: startY }, L: gurt, K: null, Aera: 9050, Sigma: null,
                pd1: { x: startX + i * gurt * scala, y: startY }, pd2: { x: startX + (i + 1) * gurt * scala, y: startY }, Ki: null, buckling: false, yield: false };
        }
        ;
        for (var i = 0; i < this.OGurten.length; i++) {
            this.Oelement[i] = { P1: { x: null, y: null }, P2: { x: null, y: null }, yield: false, buckling: false };
        }
        for (var i = 0; i < this.UGurten.length; i++) {
            this.Uelement[i] = { P1: { x: null, y: null }, P2: { x: null, y: null }, yield: false, buckling: false };
        }
        for (var i = 0; i < this.Streben.length; i++) {
            this.Selement[i] = { P1: { x: null, y: null }, P2: { x: null, y: null }, yield: false, buckling: false };
        }
        SUMV = this.A.AK.v;
        this.Streben[0].K = SUMV / cos(grad * 30);
        for (var i = 1; i < 9; i++) {
            SUMV = SUMV + AForces[i - 1].v;
            if (i / 2 === int(i / 2))
                this.Streben[i].K = SUMV / cos(30);
            else
                this.Streben[i].K = -SUMV / cos(30);
        }
        this.Streben[9].K = this.B.AK.v / cos(30);
        AUXMOM = this.A.AK.v * gurt + AForces[0].v * gurt / 2 - AForces[0].h * höhe;
        this.OGurten[0].K = AUXMOM / höhe;
        AUXMOM = this.A.AK.v * 2 * gurt + AForces[0].v * 1.5 * gurt - AForces[0].h * höhe + AForces[1].v * gurt + AForces[2].v * gurt / 2 - AForces[2].h * höhe;
        this.OGurten[1].K = AUXMOM / höhe;
        AUXMOM = this.A.AK.v * 3 * gurt + AForces[0].v * 2.5 * gurt - AForces[0].h * höhe + AForces[1].v * 2 * gurt + AForces[2].v * 1.5 * gurt - AForces[2].h * höhe + AForces[3].v * gurt +
            AForces[4].v * gurt / 2 - AForces[4].h * höhe;
        this.OGurten[2].K = AUXMOM / höhe;
        AUXMOM = this.B.AK.v * gurt + AForces[8].v * gurt / 2 + AForces[8].h * höhe;
        this.OGurten[3].K = AUXMOM / höhe;
        AUXMOM = this.A.AK.v * gurt / 2 + this.A.AK.h * höhe;
        this.UGurten[0].K = -AUXMOM / höhe;
        AUXMOM = this.A.AK.v * 1.5 * gurt + this.A.AK.h * höhe + AForces[0].v * gurt + AForces[1].v * gurt / 2 + AForces[1].h * höhe;
        this.UGurten[1].K = -AUXMOM / höhe;
        AUXMOM = this.A.AK.v * 2.5 * gurt + this.A.AK.h * höhe + AForces[0].v * 2 * gurt + AForces[1].v * 1.5 * gurt + AForces[1].h * höhe + AForces[2].v * gurt + AForces[3].v * gurt / 2 +
            AForces[3].h * höhe;
        this.UGurten[2].K = -AUXMOM / höhe;
        AUXMOM = this.A.AK.v * 3.5 * gurt + this.A.AK.h * höhe + AForces[0].v * 3 * gurt + AForces[1].v * 2.5 * gurt + AForces[1].h * höhe + AForces[2].v * 2 * gurt + AForces[3].v * 1.5 * gurt +
            AForces[3].h * höhe + AForces[4].v * gurt + AForces[5].v * gurt / 2 + AForces[5].h * höhe;
        this.UGurten[3].K = -AUXMOM / höhe;
        AUXMOM = this.B.AK.v * gurt / 2;
        this.UGurten[4].K = -AUXMOM / höhe;
        this.SigmaMax = 0;
        this.SigmaMin = 0;
        for (var i = 0; i < this.Streben.length; i++) {
            this.Streben[i].Sigma = this.Streben[i].K * 1000 / this.Streben[i].Aera;
            if (this.Streben[i].Sigma > this.SigmaMax)
                this.SigmaMax = this.Streben[i].Sigma;
            if (this.Streben[i].Sigma > SigmaF)
                this.Streben[i].yield = true;
            if (this.Streben[i].Sigma < this.SigmaMin)
                this.SigmaMin = this.Streben[i].Sigma;
            if (this.Streben[i].Sigma < SigmaK)
                this.Streben[i].buckling = true;
        }
        for (var i = 0; i < this.OGurten.length; i++) {
            this.OGurten[i].Sigma = this.OGurten[i].K * 1000 / this.OGurten[i].Aera;
            if (this.OGurten[i].Sigma > this.SigmaMax)
                this.SigmaMax = this.OGurten[i].Sigma;
            if (this.OGurten[i].Sigma > SigmaF)
                this.OGurten[i].yield = true;
            if (this.OGurten[i].Sigma < this.SigmaMin)
                this.SigmaMin = this.OGurten[i].Sigma;
            if (this.OGurten[i].Sigma < SigmaK)
                this.OGurten[i].buckling = true;
        }
        for (var i = 0; i < this.UGurten.length; i++) {
            this.UGurten[i].Sigma = this.UGurten[i].K * 1000 / this.UGurten[i].Aera;
            if (this.UGurten[i].Sigma > this.SigmaMax)
                this.SigmaMax = this.UGurten[i].Sigma;
            if (this.UGurten[i].Sigma > SigmaF)
                this.UGurten[i].yield = true;
            if (this.UGurten[i].Sigma < this.SigmaMin)
                this.SigmaMin = this.UGurten[i].Sigma;
            if (this.UGurten[i].Sigma < SigmaK)
                this.UGurten[i].buckling = true;
        }
        if (SigmaK > (this.SigmaMin))
            Bruch = true;
        else
            Bruch = false;
        if (SigmaF < (this.SigmaMax))
            Bruch = true;
        for (var i = 0; i < 9; i++) {
            iForces[i] = { h: 0, v: 0 };
        }
        for (var j = 0; j < 4; j++) {
            AH = 0;
            MAV = 0;
            MBV = 0;
            SUMV = 0;
            AUXMOM = 0;
            dummy = 0;
            iForces[j * 2 + 1] = { h: 0, v: 1 };
            for (var i = 0; i < 9; i++) {
                MBV = MBV - iForces[i].v * (9 - i) * gurt / 2;
                AH = AH + iForces[i].h;
                if (i / 2 === int(i / 2))
                    MBV = MBV + iForces[i].h * höhe;
            }
            dummy = MBV / (5 * gurt);
            this.A.AKi.h = -AH;
            this.A.AKi.v = dummy;
            for (var i = 0; i < 9; i++) {
                MAV = MAV + iForces[i].v * (i + 1) * gurt / 2;
                if (i / 2 === int(i / 2))
                    MAV = MAV + iForces[i].h * höhe;
            }
            dummy = -MAV / (5 * gurt);
            this.B.AKi.h = 0;
            this.B.AKi.v = dummy;
            SUMV = this.A.AKi.v;
            this.Streben[0].Ki = SUMV / cos(30);
            for (var i = 1; i < 9; i++) {
                SUMV = SUMV + iForces[i - 1].v;
                if (i / 2 === int(i / 2))
                    this.Streben[i].Ki = SUMV / cos(30);
                else
                    this.Streben[i].Ki = -SUMV / cos(30);
            }
            this.Streben[9].Ki = this.B.AKi.v / cos(30);
            AUXMOM = this.A.AKi.v * gurt + iForces[0].v * gurt / 2 - iForces[0].h * höhe;
            this.OGurten[0].Ki = AUXMOM / höhe;
            AUXMOM = this.A.AKi.v * 2 * gurt + iForces[0].v * 1.5 * gurt - iForces[0].h * höhe + iForces[1].v * gurt + iForces[2].v * gurt / 2 - iForces[2].h * höhe;
            this.OGurten[1].Ki = AUXMOM / höhe;
            AUXMOM = this.A.AKi.v * 3 * gurt + iForces[0].v * 2.5 * gurt - iForces[0].h * höhe + iForces[1].v * 2 * gurt + iForces[2].v * 1.5 * gurt - iForces[2].h * höhe + iForces[3].v * gurt +
                iForces[4].v * gurt / 2 - iForces[4].h * höhe;
            this.OGurten[2].Ki = AUXMOM / höhe;
            AUXMOM = this.B.AKi.v * gurt + iForces[8].v * gurt / 2 + iForces[8].h * höhe;
            this.OGurten[3].Ki = AUXMOM / höhe;
            AUXMOM = this.A.AKi.v * gurt / 2 + this.A.AKi.h * höhe;
            this.UGurten[0].Ki = -AUXMOM / höhe;
            AUXMOM = this.A.AKi.v * 1.5 * gurt + this.A.AKi.h * höhe + iForces[0].v * gurt + iForces[1].v * gurt / 2 + iForces[1].h * höhe;
            this.UGurten[1].Ki = -AUXMOM / höhe;
            AUXMOM = this.A.AKi.v * 2.5 * gurt + this.A.AKi.h * höhe + iForces[0].v * 2 * gurt + iForces[1].v * 1.5 * gurt + iForces[1].h * höhe + iForces[2].v * gurt + iForces[3].v * gurt / 2 +
                iForces[3].h * höhe;
            this.UGurten[2].Ki = -AUXMOM / höhe;
            AUXMOM = this.A.AKi.v * 3.5 * gurt + this.A.AKi.h * höhe + iForces[0].v * 3 * gurt + iForces[1].v * 2.5 * gurt + iForces[1].h * höhe + iForces[2].v * 2 * gurt + iForces[3].v * 1.5 * gurt +
                iForces[3].h * höhe + iForces[4].v * gurt + iForces[5].v * gurt / 2 + iForces[5].h * höhe;
            this.UGurten[3].Ki = -AUXMOM / höhe;
            AUXMOM = this.B.AKi.v * gurt / 2;
            this.UGurten[4].Ki = -AUXMOM / höhe;
            this.delta1 = 0;
            this.delta2 = 0;
            this.delta3 = 0;
            for (var i = 0; i < this.Streben.length; i++) {
                dummy = (this.Streben[i].Ki * this.Streben[i].K * this.Streben[i].L) / (this.Streben[i].Aera * Emodul);
                this.delta1 = this.delta1 + dummy;
            }
            for (var i = 0; i < this.OGurten.length; i++) {
                dummy = (this.OGurten[i].Ki * this.OGurten[i].K * this.OGurten[i].L) / (this.OGurten[i].Aera * Emodul);
                this.delta2 = this.delta2 + dummy;
            }
            for (var i = 0; i < this.UGurten.length; i++) {
                dummy = (this.UGurten[i].Ki * this.UGurten[i].K * this.UGurten[i].L) / (this.UGurten[i].Aera * Emodul);
                this.delta3 = this.delta3 + dummy;
            }
            this.SUMDELTA = this.delta3 + this.delta2 + this.delta1;
            this.Defor[j] = { x: 0, y: this.SUMDELTA };
            iForces[j * 2 + 1] = { h: 0, v: 0 };
        }
        for (var i = 0; i < this.OGurten.length; i++) {
            if (this.OGurten[i].yield)
                this.Oelement[i].yield = true;
            if (this.OGurten[i].buckling)
                this.Oelement[i].buckling = true;
        }
        for (var i = 0; i < this.UGurten.length; i++) {
            if (this.UGurten[i].yield)
                this.Uelement[i].yield = true;
            if (this.UGurten[i].buckling)
                this.Uelement[i].buckling = true;
        }
        for (var i = 0; i < this.Streben.length; i++) {
            if (this.Streben[i].yield)
                this.Selement[i].yield = true;
            if (this.Streben[i].buckling)
                this.Selement[i].buckling = true;
        }
    }
    TuttiFrutti.prototype.collapse = function (dgamma, knicken) {
        var dummy2;
        if (knicken) {
            this.gamma = dgamma;
            for (var i = 0; i < 6; i++) {
                var dummy = cos(this.gamma);
                if (i / 2 === int(i / 2))
                    this.PuntiC[i] = { x: this.startX + (i * scala * gurt / 2) * dummy, y: this.startY + 300 + (i * scala * gurt / 2) * dummy * tan(this.gamma) };
                else
                    this.PuntiC[i] = { x: this.startX + ((i * scala * gurt / 2) * dummy) + scala * höhe * sin(this.gamma),
                        y: this.startY + 300 + ((i * scala * gurt / 2) * dummy * tan(this.gamma)) - (scala * höhe * dummy) };
            }
            ;
            dummy2 = this.PuntiC[5].y;
            this.PuntiC[5] = { x: this.PuntiC[0].x + 2.5 * scala * gurt, y: dummy2 };
            this.PuntiC[10] = { x: this.PuntiC[0].x + 5 * scala * gurt, y: this.PuntiC[0].y };
            this.PuntiC[8] = { x: this.PuntiC[10].x - (this.PuntiC[2].x - this.PuntiC[0].x), y: this.PuntiC[2].y };
            this.PuntiC[6] = { x: this.PuntiC[10].x - (this.PuntiC[4].x - this.PuntiC[0].x), y: this.PuntiC[4].y };
            this.PuntiC[9] = { x: this.PuntiC[10].x - (this.PuntiC[1].x - this.PuntiC[0].x), y: this.PuntiC[1].y };
            this.PuntiC[7] = { x: this.PuntiC[10].x - (this.PuntiC[3].x - this.PuntiC[0].x), y: this.PuntiC[3].y };
            for (var i = 0; i < this.Oelement.length; i++) {
                this.Oelement[i].P1 = { x: this.PuntiC[i * 2 + 1].x, y: this.PuntiC[i * 2 + 1].y };
                this.Oelement[i].P2 = { x: this.PuntiC[i * 2 + 3].x, y: this.PuntiC[i * 2 + 3].y };
            }
            ;
            for (var i = 0; i < this.Uelement.length; i++) {
                this.Uelement[i].P1 = { x: this.PuntiC[i * 2].x, y: this.PuntiC[i * 2].y };
                this.Uelement[i].P2 = { x: this.PuntiC[i * 2 + 2].x, y: this.PuntiC[i * 2 + 2].y };
            }
            ;
            for (var i = 0; i < this.Selement.length; i++) {
                this.Selement[i].P1 = { x: this.PuntiC[i].x, y: this.PuntiC[i].y };
                this.Selement[i].P2 = { x: this.PuntiC[i + 1].x, y: this.PuntiC[i + 1].y };
            }
        }
    };
    TuttiFrutti.prototype.disegna = function () {
        var dummy;
        var MAXS;
        var rd1 = 50;
        var rd2 = 1350;
        for (var i = 0; i < 255; i++) {
            this.Colori[i] = { r: 234, g: 255 - i, b: i };
            fill(this.Colori[i].r, this.Colori[i].g, this.Colori[i].b);
            stroke(this.Colori[i].r, this.Colori[i].g, this.Colori[i].b);
            ellipse(10 + 8 * i, 1000, 8, 8);
        }
        noStroke();
        fill(255, 255, 255);
        stroke(21, 233, 216);
        strokeWeight(1);
        textSize(14);
        noFill();
        Crash(rd1 + 220, 75, SigmaF);
        Crash(rd1 + 220, 105, SigmaK);
        stroke(21, 233, 216);
        text('LEGENDE', rd1, 50);
        text('Element Collaps durch Fliessen = ', rd1, 80);
        text('Element Collaps durch Knicken = ', rd1, 110);
        text('Spannungen in N/mm2', rd1, 140);
        text('Kraefte in kN', rd1, 170);
        text('Abmesungen in m', rd1, 200);
        text('Verformungen in m', rd1, 230);
        text('FACHWERK', rd1, 290);
        text('Spannweite ' + gurt * 5, rd1, 320);
        text('Hoehe ' + höhe, rd1, 350);
        text('AAKh ' + round(this.A.AK.h) + '  AAKv  ' + round(this.A.AK.v) + ' AAKhi ' + (this.A.AKi.h) + '  AAKvi ' + (this.A.AKi.v), rd2, 50);
        text('BAKh ' + round(this.B.AK.h) + '  BAKv  ' + round(this.B.AK.v) + ' BAKhi ' + (this.B.AKi.h) + '  BAKvi ' + (this.B.AKi.v), rd2, 80);
        text('delta1 ' + nfs(this.Defor[0].y, 2, 3), rd2, 110);
        text('delta2 ' + nfs(this.Defor[1].y, 2, 3), rd2, 140);
        text('delta3 ' + nfs(this.Defor[2].y, 2, 3), rd2, 170);
        text('delta4 ' + nfs(this.Defor[3].y, 2, 3), rd2, 200);
        text('dGamma ' + this.gamma, rd2, 230);
        text('SigmaMAX   ' + round(this.SigmaMax) + '   SigmaF    ' + SigmaF, rd2, 260);
        text('SigmaMIN   ' + round(this.SigmaMin) + '   SigmaK    ' + SigmaK, rd2, 290);
        text('Collaps     ' + Bruch, rd2, 320);
        for (var i = 0; i < this.Streben.length; i++) {
            text(' Strebe ' + i + '  K  ' + round(this.Streben[i].K) + '   Sigma    ' + round(this.Streben[i].Sigma) + '    Ki   ' + nfs(this.Streben[i].Ki, 2, 2) +
                '  Fliessen  ' + (this.Streben[i].yield) + '  Knicken  ' + (this.Streben[i].buckling), rd2, 360 + 30 * i);
        }
        ;
        for (var i = 0; i < this.OGurten.length; i++) {
            text(' OGurt  ' + i + ' K  ' + round(this.OGurten[i].K) + '   Sigma    ' + round(this.OGurten[i].Sigma) + '     Ki   ' + nfs(this.OGurten[i].Ki, 2, 2) +
                '  Fliessen  ' + (this.OGurten[i].yield) + '  Knicken  ' + (this.OGurten[i].buckling), rd2, 690 + 30 * i);
        }
        ;
        for (var i = 0; i < this.UGurten.length; i++) {
            text(' UGurt  ' + i + ' K  ' + round(this.UGurten[i].K) + '   Sigma     ' + round(this.UGurten[i].Sigma) + '    Ki  ' + nfs(this.UGurten[i].Ki, 2, 2) +
                '  Fliessen  ' + (this.UGurten[i].yield) + '  Knicken  ' + (this.UGurten[i].buckling), rd2, 840 + 30 * i);
        }
        line(this.Punti[0].x, this.Punti[0].y, this.Punti[10].x, this.Punti[10].y);
        line(this.Punti[1].x, this.Punti[1].y, this.Punti[9].x, this.Punti[9].y);
        for (var i = 0; i < this.Punti.length - 1; i++) {
            line(this.Punti[i].x, this.Punti[i].y, this.Punti[i + 1].x, this.Punti[i + 1].y);
        }
        ;
        stroke(234, 35, 35);
        triangle(this.Punti[0].x, this.Punti[0].y, this.Punti[0].x - 5, this.Punti[0].y + 10, this.Punti[0].x + 5, this.Punti[0].y + 10);
        rect(this.Punti[10].x - 10, this.Punti[10].y + 10, 20, 20);
        ellipse(this.Punti[10].x, this.Punti[10].y + 5, 10, 10);
        textAlign(CENTER);
        for (var i = 0; i < this.Streben.length; i++) {
            text(i, (this.Punti[i].x + this.Punti[i + 1].x) / 2, (this.Punti[i].y + this.Punti[i + 1].y) / 2);
        }
        for (var i = 0; i < this.OGurten.length; i++) {
            text(i, this.Punti[2 + i * 2].x, this.Punti[1].y);
        }
        for (var i = 0; i < this.UGurten.length; i++) {
            text(i, this.Punti[1 + i * 2].x, this.Punti[0].y);
        }
        textAlign(LEFT);
        text('Auflager A ', this.Punti[0].x, this.Punti[0].y + 50);
        textAlign(RIGHT);
        text('Auflager B ', this.Punti[10].x, this.Punti[10].y + 50);
        textAlign(LEFT);
        text('SYSTEM ', this.Punti[0].x - 50, this.Punti[1].y - 60);
        text('AEUSSERE KRAEFTE ', this.UGurten[0].pd1.x - 50, this.OGurten[0].pd1.y - 100);
        textAlign(LEFT);
        text('Strebe ', 1100, (this.Punti[0].y + this.Punti[1].y) / 2);
        text('Obergurt ', 1100, this.Punti[1].y);
        text('Untergurt ', 1100, this.Punti[0].y);
        if (Bruch)
            text('VERFORMUNGEN / COLLAPS ', this.UGurten[0].pd1.x - 50, this.OGurten[0].pd1.y + 300 - 60);
        else
            text('VERFORMUNGEN  ', this.UGurten[0].pd1.x - 50, this.OGurten[0].pd1.y + 300 - 60);
        stroke(255, 255, 255);
        for (var i = 0; i < this.Streben.length; i++) {
            line(this.Streben[i].pd1.x, this.Streben[i].pd1.y, this.Streben[i].pd2.x, this.Streben[i].pd2.y);
        }
        ;
        for (var i = 0; i < this.OGurten.length; i++) {
            line(this.OGurten[i].pd1.x, this.OGurten[i].pd1.y, this.OGurten[i].pd2.x, this.OGurten[i].pd2.y);
        }
        ;
        for (var i = 0; i < this.UGurten.length; i++) {
            line(this.UGurten[i].pd1.x, this.UGurten[i].pd1.y, this.UGurten[i].pd2.x, this.UGurten[i].pd2.y);
        }
        ;
        strokeWeight(3);
        if (this.SigmaMax > abs(this.SigmaMin))
            MAXS = this.SigmaMax;
        else
            MAXS = abs(this.SigmaMin);
        for (var i = 0; i < this.UGurten.length; i++) {
            dummy = abs(this.UGurten[i].Sigma * 254 / MAXS);
            stroke(this.Colori[round(dummy)].r, this.Colori[round(dummy)].g, this.Colori[round(dummy)].b);
            line(this.UGurten[i].pd1.x, this.UGurten[i].pd1.y, this.UGurten[i].pd2.x, this.UGurten[i].pd2.y);
            if (this.UGurten[i].yield)
                Crash((this.UGurten[i].pd1.x + this.UGurten[i].pd2.x) / 2, this.UGurten[i].pd1.y, this.SigmaMax);
            if (this.UGurten[i].buckling)
                Crash((this.UGurten[i].pd1.x + this.UGurten[i].pd2.x) / 2, this.UGurten[i].pd1.y, this.SigmaMin);
        }
        for (var i = 0; i < this.OGurten.length; i++) {
            dummy = abs(this.OGurten[i].Sigma * 234 / MAXS);
            stroke(this.Colori[round(dummy)].r, this.Colori[round(dummy)].g, this.Colori[round(dummy)].b);
            line(this.OGurten[i].pd1.x, this.OGurten[i].pd1.y, this.OGurten[i].pd2.x, this.OGurten[i].pd2.y);
            if (this.OGurten[i].yield)
                Crash((this.OGurten[i].pd1.x + this.OGurten[i].pd2.x) / 2, this.OGurten[i].pd1.y, this.SigmaMax);
            if (this.OGurten[i].buckling)
                Crash((this.OGurten[i].pd1.x + this.OGurten[i].pd2.x) / 2, this.OGurten[i].pd1.y, this.SigmaMin);
        }
        for (var i = 0; i < this.Streben.length; i++) {
            dummy = abs(this.Streben[i].Sigma * 254 / MAXS);
            stroke(this.Colori[round(dummy)].r, this.Colori[round(dummy)].g, this.Colori[round(dummy)].b);
            line(this.Streben[i].pd1.x, this.Streben[i].pd1.y, this.Streben[i].pd2.x, this.Streben[i].pd2.y);
            if (this.Streben[i].yield)
                Crash((this.Streben[i].pd1.x + this.Streben[i].pd2.x) / 2, (this.Streben[i].pd1.y + this.Streben[i].pd2.y) / 2, this.SigmaMax);
            if (this.Streben[i].buckling)
                Crash((this.Streben[i].pd1.x + this.Streben[i].pd2.x) / 2, (this.Streben[i].pd1.y + this.Streben[i].pd2.y) / 2, this.SigmaMin);
        }
        stroke(255, 255, 255);
        LastPfeile(this.A.pd.x, this.A.P.y, round(this.A.AK.h), round(this.A.AK.v));
        LastPfeile(this.B.pd.x, this.B.P.y, round(this.B.AK.h), round(this.B.AK.v));
        for (var i = 0; i < this.BForces.length; i++) {
            LastPfeile(this.Streben[i].pd2.x, this.Streben[i].pd2.y, this.BForces[i].h, this.BForces[i].v);
        }
        stroke(255, 255, 255);
        strokeWeight(1);
        for (var i = 0; i < this.Streben.length; i++) {
            line(this.Streben[i].pd1.x, this.Streben[i].pd1.y + 300, this.Streben[i].pd2.x, this.Streben[i].pd2.y + 300);
            if (this.Streben[i].yield)
                Crash((this.Streben[i].pd1.x + this.Streben[i].pd2.x) / 2, (this.Streben[i].pd1.y + 300 + this.Streben[i].pd2.y) / 2, this.SigmaMax);
            if (this.Streben[i].buckling)
                Crash((this.Streben[i].pd1.x + this.Streben[i].pd2.x) / 2, (this.Streben[i].pd1.y + 300 + this.Streben[i].pd2.y + 300) / 2, this.SigmaMin);
        }
        for (var i = 0; i < this.OGurten.length; i++) {
            line(this.OGurten[i].pd1.x, this.OGurten[i].pd1.y + 300, this.OGurten[i].pd2.x, this.OGurten[i].pd2.y + 300);
            if (this.OGurten[i].yield)
                Crash((this.OGurten[i].pd1.x + this.OGurten[i].pd2.x) / 2, this.OGurten[i].pd1.y + 300, this.SigmaMax);
            if (this.OGurten[i].buckling)
                Crash((this.OGurten[i].pd1.x + this.OGurten[i].pd2.x) / 2, this.OGurten[i].pd1.y + 300, this.SigmaMin);
        }
        for (var i = 0; i < this.UGurten.length; i++) {
            line(this.UGurten[i].pd1.x, this.UGurten[i].pd1.y + 300, this.UGurten[i].pd2.x, this.UGurten[i].pd2.y + 300);
            if (this.UGurten[i].yield)
                Crash((this.UGurten[i].pd1.x + this.UGurten[i].pd2.x) / 2, this.UGurten[i].pd1.y + 300, this.SigmaMax);
            if (this.UGurten[i].buckling)
                Crash((this.UGurten[i].pd1.x + this.UGurten[i].pd2.x) / 2, this.UGurten[i].pd1.y + 300, this.SigmaMin);
        }
        for (var i = 0; i < 4; i++) {
            LastPfeile(this.Streben[i * 2 + 1].pd2.x, this.Streben[i * 2 + 1].pd2.y + 300 + scala * this.Defor[i].y, 0, this.Defor[i].y);
        }
        ;
        stroke(234, 35, 35);
        strokeWeight(3);
        for (var i = 0; i < this.Oelement.length; i++) {
            if (this.Oelement[i].buckling) {
                Arco(this.Oelement[i].P1, this.Oelement[i].P2, 2, 234, 35, 35);
                strokeWeight(3);
            }
            else if (this.Oelement[i].yield) {
                Fliessen(this.Oelement[i].P1, this.Oelement[i].P2);
                strokeWeight(3);
            }
            else
                line(this.Oelement[i].P1.x, this.Oelement[i].P1.y, this.Oelement[i].P2.x, this.Oelement[i].P2.y);
        }
        for (var i = 0; i < this.Uelement.length; i++) {
            if (this.Uelement[i].buckling) {
                Arco(this.Uelement[i].P1, this.Uelement[i].P2, 2, 234, 35, 35);
                strokeWeight(3);
            }
            else if (this.Uelement[i].yield) {
                Fliessen(this.Uelement[i].P1, this.Uelement[i].P2);
                strokeWeight(3);
            }
            else
                line(this.Uelement[i].P1.x, this.Uelement[i].P1.y, this.Uelement[i].P2.x, this.Uelement[i].P2.y);
        }
        for (var i = 0; i < this.Selement.length; i++) {
            if (this.Streben[i].buckling) {
                Arco(this.Selement[i].P1, this.Selement[i].P2, 2, 234, 35, 35);
                strokeWeight(3);
            }
            else if (this.Selement[i].yield) {
                Fliessen(this.Selement[i].P1, this.Selement[i].P2);
                strokeWeight(3);
            }
            else
                line(this.Selement[i].P1.x, this.Selement[i].P1.y, this.Selement[i].P2.x, this.Selement[i].P2.y);
        }
        strokeWeight(1);
    };
    return TuttiFrutti;
}());
var frutta;
function setup() {
    createCanvas(displayWidth, displayHeight);
    frameRate(30);
    fill(color(255, 255, 255));
    rect(0, 0, displayWidth, displayHeight);
    angleMode(DEGREES);
    for (var i = 0; i < 9; i++) {
        if (i / 2 === int(i / 2))
            Forces[i] = { h: null, v: 700 };
        else
            Forces[i] = { h: null, v: 1000 - i * 100 };
    }
    frutta = new TuttiFrutti(displayWidth / 4, displayHeight / 2.2, Forces);
    frutta.collapse(0, Bruch);
}
function draw() {
    clear();
    fill(color(0, 8, 88));
    rect(0, 0, displayWidth, displayHeight);
    if (frameCount > 30)
        if (frameCount < 160) {
            frutta.collapse((frameCount - 30) / 5, Bruch);
        }
    frutta.disegna();
}
//# sourceMappingURL=build.js.map
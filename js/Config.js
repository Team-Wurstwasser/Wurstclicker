(function(App) {
    'use strict';

    App.factoryConfig = {
        huette: {
            name: "Keks Hütte",
            basePrice: new Decimal(15),
            cps: new Decimal(1),
            priceMultiplier: new Decimal(1.15),
            icon: "img/Huette.png"
        },
        kristall: {
            name: "Kristall-Konditorei",
            basePrice: new Decimal(100),
            cps: new Decimal(5),
            priceMultiplier: new Decimal(1.15),
            icon: "img/Kristall.png"
        },
        plasma: {
            name: "Plasma-Keks-Generator",
            basePrice: new Decimal(1100),
            cps: new Decimal(40),
            priceMultiplier: new Decimal(1.15),
            icon: "img/Plasma.png"
        },
        labor: {
            name: "Licht-Keks-Labor",
            basePrice: new Decimal(12000),
            cps: new Decimal(200),
            priceMultiplier: new Decimal(1.15),
            icon: "img/Labor.png"
        },
        former: {
            name: "Makro-Keks-Former",
            basePrice: new Decimal(130000),
            cps: new Decimal(1000),
            priceMultiplier: new Decimal(1.15),
            icon: "img/Former.png"
        },
        ofen: {
            name: "Schwerkraft-Ofen",
            basePrice: new Decimal(1400000),
            cps: new Decimal(6500),
            priceMultiplier: new Decimal(1.15),
            icon: "img/Ofen.png"
        },
        sonde: {
            name: "Back-Sonde",
            basePrice: new Decimal(20000000),
            cps: new Decimal(40000),
            priceMultiplier: new Decimal(1.15),
            icon: "img/Sonde.png"
        }
    };

    App.upgradeConfig = {
        click_1: {
            name: "Verstärkter Zeigefinger",
            type: "clickBoost",
            boost: new Decimal(1),
            price: new Decimal(50),
            icon: "img/Keks.svg",
            desc: "Jeder Klick bringt +{value} Keks{e} mehr."
        },
        click_2: {
            name: "Titan-Mausrad",
            type: "clickMultiplier",
            factor: new Decimal(2),
            price: new Decimal(2500),
            icon: "img/Keks.svg",
            desc: "Verdoppelt die Effizienz deiner Klicks!"
        },
        click_3: {
            name: "Präzisions-Cursor",
            type: "clickMultiplier",
            factor: new Decimal(2),
            price: new Decimal(50000),
            icon: "img/Keks.svg",
            desc: "Verdoppelt die Klickkraft."
        },
        click_4: {
            name: "Verstärkte Maustaste",
            type: "clickMultiplier",
            factor: new Decimal(2),
            price: new Decimal(10000000),
            icon: "img/Keks.svg",
            desc: "Verdoppelt die Klickkraft."
        },
        click_5: {
            name: "Reaktions-Trigger",
            type: "clickMultiplier",
            factor: new Decimal(5),
            price: new Decimal(250000000),
            icon: "img/Keks.svg",
            desc: "Verfünffacht die Effizienz deiner Klicks!"
        },
        click_6: {
            name: "Hyper-Cursor",
            type: "clickMultiplier",
            factor: new Decimal(5),
            price: new Decimal(7500000000),
            icon: "img/Keks.svg",
            desc: "Deine Klicks sind nun 5-mal so mächtig."
        },
        click_7: {
            name: "Impuls-Verstärker",
            type: "clickMultiplier",
            factor: new Decimal(10),
            price: new Decimal(150000000000),
            icon: "img/Keks.svg",
            desc: "Deine Klicks werden zehnmal stärker."
        },
        click_8: {
            name: "Quanten-Treffer",
            type: "clickMultiplier",
            factor: new Decimal(10),
            price: new Decimal(750000000000),
            icon: "img/Keks.svg",
            desc: "Deine Klicks werden zehnmal stärker."
        },
        huette_1: {
            name: "Bio-Keks",
            type: "factoryMultiplier",
            target: "huette",
            price: new Decimal(500),
            factor: new Decimal(2),
            icon: "img/Huette.png",
            desc: "Die Keks-Hütten produzieren doppelt so schnell."
        },
        huette_2: {
            name: "Keks-Mutation",
            type: "factoryMultiplier",
            target: "huette",
            price: new Decimal(15000),
            factor: new Decimal(4),
            icon: "img/Huette.png",
            desc: "Die Keks ist nun intelligent. Hütten produzieren 4-mal so viel."
        },
        huette_3: {
            name: "Hütten-Automatik",
            type: "factoryMultiplier",
            target: "huette",
            price: new Decimal(100000),
            factor: new Decimal(10),
            icon: "img/Huette.png",
            desc: "Vollautomatische Teigführung. Hütten x10."
        },
        kristall_1: {
            name: "Hochglanz-Prismen",
            type: "factoryMultiplier",
            target: "kristall",
            price: new Decimal(5000),
            factor: new Decimal(2),
            icon: "img/Kristall.png",
            desc: "Kristall-Konditoreien glänzen mit 100% mehr Ertrag."
        },
        kristall_2: {
            name: "Zucker-Diamanten",
            type: "factoryMultiplier",
            target: "kristall",
            price: new Decimal(250000),
            factor: new Decimal(4),
            icon: "img/Kristall.png",
            desc: "Konditoreien produzieren 4-mal so viel."
        },
        kristall_3: {
            name: "Reinstkristall-Gitter",
            type: "factoryMultiplier",
            target: "kristall",
            price: new Decimal(25000000),
            factor: new Decimal(8),
            icon: "img/Kristall.png",
            desc: "Perfekte Molekularstruktur. Kristall-Konditoreien x8."
        },
        plasma_1: {
            name: "Ionen-Beschleuniger",
            type: "factoryMultiplier",
            target: "plasma",
            price: new Decimal(50000),
            factor: new Decimal(2),
            icon: "img/Plasma.png",
            desc: "Stabilisiert den Plasma-Fluss für doppelte Produktion."
        },
        plasma_2: {
            name: "Dunkle Materie Kern",
            type: "factoryMultiplier",
            target: "plasma",
            price: new Decimal(3000000),
            factor: new Decimal(4),
            icon: "img/Plasma.png",
            desc: "Plasma-Generatoren erreichen die kritische Masse. Output x4."
        },
        plasma_3: {
            name: "Supernova-Einspeisung",
            type: "factoryMultiplier",
            target: "plasma",
            price: new Decimal(150000000),
            factor: new Decimal(10),
            icon: "img/Plasma.png",
            desc: "Direkte Energie aus dem Kern eines Sterns. Plasma x10."
        },
        labor_1: {
            name: "Quanten-Backofen",
            type: "factoryMultiplier",
            target: "labor",
            price: new Decimal(500000),
            factor: new Decimal(2),
            icon: "img/Labor.png",
            desc: "Licht-Keks-Labore verdoppeln ihren Output."
        },
        labor_2: {
            name: "Zeitkrümmungs-Backen",
            type: "factoryMultiplier",
            target: "labor",
            price: new Decimal(40000000),
            factor: new Decimal(4),
            icon: "img/Labor.png",
            desc: "Die Kekse sind fertig, bevor der Teig existiert. Labor x4."
        },
        labor_3: {
            name: "Parallelwelt-Labor",
            type: "factoryMultiplier",
            target: "labor",
            price: new Decimal(2000000000),
            factor: new Decimal(10),
            icon: "img/Labor.png",
            desc: "Importiert Kekse aus Dimensionen, in denen es nur Kekse gibt. x10."
        },
        former_1: {
            name: "Atomare Symmetrie",
            type: "factoryMultiplier",
            target: "former",
            price: new Decimal(50000000),
            factor: new Decimal(2),
            icon: "img/Former.png",
            desc: "Makro-Keks-Former arbeiten nun doppelt so effizient."
        },
        former_2: {
            name: "Fraktale Geometrie",
            type: "factoryMultiplier",
            target: "former",
            price: new Decimal(5000000000),
            factor: new Decimal(15),
            icon: "img/Former.png",
            desc: "Die Formgebung ist nun 15-mal effizienter."
        },
        former_3: {
            name: "Fraktale Geometrie",
            type: "factoryMultiplier",
            target: "former",
            price: new Decimal(9000000000000),
            factor: new Decimal(4),
            icon: "img/Former.png",
            desc: "Die Formgebung ist nun 4-mal effizienter."
        },
        ofen_1: {
            name: "Ereignishorizont-Grill",
            type: "factoryMultiplier",
            target: "ofen",
            price: new Decimal(5000000000),
            factor: new Decimal(2),
            icon: "img/Ofen.png",
            desc: "Schwerkraft-Öfen nutzen die Krümmung für doppeltes Backtempo."
        },
        ofen_2: {
            name: "Singularitäts-Hitze",
            type: "factoryMultiplier",
            target: "ofen",
            price: new Decimal(250000000000),
            factor: new Decimal(4),
            icon: "img/Ofen.png",
            desc: "Die Hitze eines sterbenden Sterns. Schwerkraft-Öfen x4."
        },
        ofen_3: {
            name: "Wurst-Hitze",
            type: "factoryMultiplier",
            target: "ofen",
            price: new Decimal(25000000000000),
            factor: new Decimal(4),
            icon: "img/Ofen.png",
            desc: "Die Hitze eines sterbenden Wurst. Schwerkraft-Öfen x4."
        },
        sonde_1: {
            name: "Deep-Space-Backen",
            type: "factoryMultiplier",
            target: "sonde",
            price: new Decimal(50000000000),
            factor: new Decimal(2),
            icon: "img/Sonde.png",
            desc: "Back-Sonden finden effizientere Routen im All x2."
        },
        sonde_2: {
            name: "Galaktisches Netzwerk",
            type: "factoryMultiplier",
            target: "sonde",
            price: new Decimal(1000000000000),
            factor: new Decimal(5),
            icon: "img/Sonde.png",
            desc: "Ein intergalaktisches Liefernetzwerk. Sonden-Effizienz x5."
        },
        global_1: {
            name: "Keks-Imperium",
            type: "globalMultiplier",
            factor: new Decimal(1.5),
            price: new Decimal(1000000000000),
            icon: "img/Logo.png",
            desc: "Erhöht die Produktion um 50%!"
        },
        global_2: {
            name: "Keks-Relativität",
            type: "globalMultiplier",
            factor: new Decimal(2),
            price: new Decimal(50000000000000),
            icon: "img/Logo.png",
            desc: "E=mc²? Nein, Energie = mehr Cookies! Alles wird verdoppelt."
        },
        global_3: {
            name: "Universelle Keks-Konstante",
            type: "globalMultiplier",
            factor: new Decimal(5),
            price: new Decimal(1000000000000000),
            icon: "img/Logo.png",
            desc: "Das Universum besteht nun zu 5% aus Keksteig. Alles x5."
        },
        global_4: {
            name: "Multiversale Kekse",
            type: "globalMultiplier",
            factor: new Decimal(10),
            price: new Decimal("1e18"),
            icon: "img/Logo.png",
            desc: "Ein schwarzes Loch aus Schokolade zieht Kekse aus Paralleluniversen an. Alles x10."
        },
        global_5: {
            name: "Quanten-Verschränkung",
            type: "globalMultiplier",
            factor: new Decimal(25),
            price: new Decimal("1e22"),
            icon: "img/Logo.png",
            desc: "Jedes Atom im Raumzeit-Kontinuum verhält sich nun gleichzeitig wie ein Keks. Produktion x25."
        },
        global_6: {
            name: "Die Wurst-Keks-Fusion",
            type: "globalMultiplier",
            factor: new Decimal(100),
            price: new Decimal("1e27"),
            icon: "img/Logo.png",
            desc: "Die ultimative Vereinigung zweier Welten. Bricht die Gesetze der Physik und multipliziert alles mit 100!"
        }
    };

    App.rebirthConfig = {
        baseCookies: new Decimal(1000000),
        bonusPerPoint: new Decimal(0.05),
        pointsMultiplier: new Decimal(1.15)
    };

    App.rebirthTreeConfig = {
        root: {
            name: "Wurstwasser-Quelle",
            desc: "Gewährt +1 Basis-Klickkraft.",
            type: "clickBoost",
            value: new Decimal(1),
            cost: new Decimal(1),
            icon: "img/Logo.png",
            x: 800,
            y: 130,
            parents: []
        },
        click_1: {
            name: "Wurstfinger",
            desc: "Klicks x2.",
            type: "clickMultiplier",
            factor: new Decimal(2),
            cost: new Decimal(2),
            icon: "img/Keks.svg",
            x: 200, 
            y: 180,
            parents: ["root"]
        },
        mid_1: {
            name: "Wurst-Keks-Symbiose",
            desc: "Doppelte Produktion für ALLES.",
            type: "globalMultiplier",
            factor: new Decimal(2),
            cost: new Decimal(4),
            icon: "img/Logo.png",
            x: 800,
            y: 320,
            parents: ["root"]
        },
        idle_1: {
            name: "Passives Backen",
            desc: "Alle produzieren 25% mehr.",
            type: "globalMultiplier",
            factor: new Decimal(1.25),
            cost: new Decimal(2),
            icon: "img/Ofen.png",
            x: 1400,
            y: 180,
            parents: ["root"]
        },
        click_2: {
            name: "Senf-Schub",
            desc: "Klicks +15.",
            type: "clickBoost",
            value: new Decimal(15),
            cost: new Decimal(5),
            icon: "img/Keks.svg",
            x: 200,
            y: 320,
            parents: ["click_1"]
        },
        mid_2: {
            name: "Wurst-Laboratorien",
            desc: "Licht-Keks-Labore (x5).",
            type: "factoryMultiplier",
            target: "labor",
            factor: new Decimal(5),
            cost: new Decimal(10),
            icon: "img/Labor.png",
            x: 800,
            y: 500,
            parents: ["mid_1"]
        },
        idle_2: {
            name: "Dauerwurst",
            desc: "Alles x2.",
            type: "globalMultiplier",
            factor: new Decimal(2),
            cost: new Decimal(5),
            icon: "img/Huette.png",
            x: 1400,
            y: 320,
            parents: ["idle_1"]
        },
        left_1: {
            name: "Wurst-Aktien",
            desc: "Alles x2.",
            type: "globalMultiplier",
            factor: new Decimal(2),
            cost: new Decimal(15),
            icon: "img/Logo.png",
            x: 200,
            y: 460,
            parents: ["click_2"]
        },        
        bridge_l: {
            name: "Klick-Synergie",
            desc: "Labore verstärken Klicks x10.",
            type: "clickMultiplier",
            factor: new Decimal(10),
            cost: new Decimal(25),
            icon: "img/Keks.svg",
            x: 500,
            y: 400,
            parents: ["click_2", "mid_2"]
        },
        bridge_r: {
            name: "Maschinen-Kult",
            desc: "Labor-Wissen optimiert. Global x3.",
            type: "globalMultiplier",
            factor: new Decimal(3),
            cost: new Decimal(25),
            icon: "img/Former.png",
            x: 1100,
            y: 400,
            parents: ["idle_2", "mid_2"]
        },
        idle_3: {
            name: "Plasma-Würstchen",
            desc: "Plasma-Generatoren x10.",
            type: "factoryMultiplier",
            target: "plasma",
            factor: new Decimal(10),
            cost: new Decimal(15),
            icon: "img/Plasma.png",
            x: 1400,
            y: 460,
            parents: ["idle_2"]
        },
        left_2: {
            name: "Gott-Wurst",
            desc: "Die Wurst bekommt ein neues Rezept.",
            type: "globalMultiplier",
            factor: new Decimal(2),
            cost: new Decimal(40),
            icon: "img/Logo.png",
            x: 200,
            y: 700,
            parents: ["left_1", "bridge_l"]
        },
        mid_3: {
            name: "Dimensions-Senf",
            desc: "Alles produziert x5.",
            type: "globalMultiplier",
            factor: new Decimal(5),
            cost: new Decimal(60),
            icon: "img/Logo.png",
            x: 800,
            y: 700,
            parents: ["bridge_l", "bridge_r"]
        },
        idle_4: {
            name: "Galaktisches Netz",
            desc: "Alles x5.",
            type: "globalMultiplier",
            factor: new Decimal(5),
            cost: new Decimal(40),
            icon: "img/Logo.png",
            x: 1400,
            y: 700,
            parents: ["idle_3", "bridge_r"]
        },
        apex: {
            name: "Heiliger Wurstkeks",
            desc: "Der Höhepunkt. Alles mal 15!",
            type: "globalMultiplier",
            factor: new Decimal(15),
            cost: new Decimal(250),
            icon: "img/Logo.png",
            x: 800,
            y: 870,
            parents: ["click_4", "mid_3", "idle_4"]
        }
    };

    Object.freeze(App.factoryConfig);
    Object.freeze(App.upgradeConfig);
    Object.freeze(App.rebirthTreeConfig);
    Object.freeze(App.rebirthConfig);
    
})(window.GameApp = window.GameApp || {});
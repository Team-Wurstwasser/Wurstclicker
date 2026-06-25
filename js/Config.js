const factoryConfig = {
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

const upgradeConfig = {
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
    click_9: {
        name: "Kraft-Resonator",
        type: "clickMultiplier",
        factor: new Decimal(25),
        price: new Decimal(1000000000000000),
        icon: "img/Keks.svg",
        desc: "Deine Klicks sind nun 25-mal so mächtig."
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
        desc: "Erhöht die Produktion ALLER Gebäude um 50%!"
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
    }
};

const rebirthConfig = {
    baseCookies: new Decimal(1000000),
    bonusPerPoint: new Decimal(0.05),
    pointsMultiplier: new Decimal(1.15)
};

const rebirthTreeConfig = {
    root: {
        name: "Rebirth-Kern",
        desc: "Der Startpunkt des dauerhaften Mindmaps.",
        type: "clickBonus",
        bonus: new Decimal(1),
        cost: new Decimal(1),
        icon: "img/Logo.png",
        x: 530,
        y: 70,
        parents: []
    },
    quick_1: {
        name: "Schnellfinger",
        desc: "Ein kleiner Bonus für jeden Klick.",
        type: "clickBonus",
        bonus: new Decimal(1),
        cost: new Decimal(2),
        icon: "img/Keks.svg",
        x: 300,
        y: 220,
        parents: ["root"]
    },
    quick_2: {
        name: "Doppelklick",
        desc: "Verdoppelt die Klickkraft.",
        type: "clickMultiplier",
        factor: new Decimal(2),
        cost: new Decimal(4),
        icon: "img/Keks.svg",
        x: 190,
        y: 380,
        parents: ["quick_1"]
    },
    quick_3: {
        name: "Klick-Ritual",
        desc: "Klicks werden noch einmal deutlich stärker.",
        type: "clickBonus",
        bonus: new Decimal(3),
        cost: new Decimal(7),
        icon: "img/Keks.svg",
        x: 120,
        y: 540,
        parents: ["quick_2"]
    },
    oven_1: {
        name: "Ofen-Segen",
        desc: "Alle Gebäude arbeiten effizienter.",
        type: "globalMultiplier",
        factor: new Decimal(1.25),
        cost: new Decimal(2),
        icon: "img/Logo.png",
        x: 760,
        y: 220,
        parents: ["root"]
    },
    oven_2: {
        name: "Produktionskette",
        desc: "Noch mehr Produktionskraft für alles.",
        type: "globalMultiplier",
        factor: new Decimal(1.5),
        cost: new Decimal(4),
        icon: "img/Logo.png",
        x: 870,
        y: 380,
        parents: ["oven_1"]
    },
    oven_3: {
        name: "Massenproduktion",
        desc: "Ofen bekommen einen großen Schub.",
        type: "factoryMultiplier",
        target: "ofen",
        factor: new Decimal(2),
        cost: new Decimal(7),
        icon: "img/Logo.png",
        x: 960,
        y: 540,
        parents: ["oven_2"]
    },
    core_1: {
        name: "Wurstgehirn",
        desc: "Klicks und Produktion treffen sich in der Mitte.",
        type: "clickMultiplier",
        factor: new Decimal(2),
        cost: new Decimal(3),
        icon: "img/Logo.png",
        x: 530,
        y: 250,
        parents: ["root"]
    },
    apex: {
        name: "Heilige Krume",
        desc: "Der Endpunkt des Baums mit einem starken Gesamtbonus.",
        type: "globalMultiplier",
        factor: new Decimal(2),
        cost: new Decimal(10),
        icon: "img/Keks.svg",
        x: 530,
        y: 640,
        parents: ["quick_3", "oven_3", "core_1"]
    }
};
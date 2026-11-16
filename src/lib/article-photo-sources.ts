interface ArticlePhotoSource {
  photographer: string;
  source: string;
  alt: string;
  position: string;
  smallWidth: number;
  smallHeight: number;
  largeWidth: number;
  largeHeight: number;
}

export const articlePhotoSources: Record<string, ArticlePhotoSource> = {
  "warehouse-returns-case": {
    "photographer": "Thirdman",
    "source": "https://www.pexels.com/photo/a-man-opening-a-brown-cardboard-box-7180911/",
    "alt": "Один человек открывает картонную коробку, другой снимает её на смартфон",
    "position": "56% 49%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 853
  },
  "first-warehouse-month": {
    "photographer": "EqualStock IN",
    "source": "https://www.pexels.com/photo/female-worker-organizing-warehouse-inventory-31112240/",
    "alt": "Сотрудница склада сверяет бумажный лист в проходе между стеллажами с синими контейнерами",
    "position": "42% 56%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 853
  },
  "first-warehouse-invoice": {
    "photographer": "Daniel Andraski",
    "source": "https://www.pexels.com/photo/close-up-shot-of-a-person-doing-a-checklist-12234106/",
    "alt": "Сотрудник склада делает отметки на бумажном бланке у стеллажа с коробками",
    "position": "54% 50%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 853
  },
  "order-picking-check": {
    "photographer": "RDNE Stock project",
    "source": "https://www.pexels.com/photo/deliveryman-scanning-the-barcode-7363196/",
    "alt": "Сотрудник сканирует штрихкод на посылке смартфоном",
    "position": "50% 52%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 854
  },
  "warehouse-location-labels": {
    "photographer": "Engin Akyurt",
    "source": "https://www.pexels.com/photo/green-metal-shelves-with-construction-materials-4170172/",
    "alt": "Проход между высокими складскими стеллажами с металлическими деталями и коробками",
    "position": "50% 52%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 854
  },
  "receiving-discrepancies": {
    "photographer": "Artem Podrez",
    "source": "https://www.pexels.com/photo/man-writing-on-a-clipboard-while-near-the-cardboard-boxes-5025647/",
    "alt": "Сотрудник записывает данные рядом с коробками в фургоне",
    "position": "50% 54%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 853
  },
  "cycle-counting": {
    "photographer": "Tiger Lily",
    "source": "https://www.pexels.com/photo/employee-looking-at-an-inventory-4484047/",
    "alt": "Сотрудник сверяет данные на планшете на фоне складских стеллажей",
    "position": "50% 53%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 853
  },
  "warehouse-site-audit": {
    "photographer": "Centre for Ageing Better",
    "source": "https://www.pexels.com/photo/employees-looking-at-the-clipboard-while-standing-near-metal-shelves-13804490/",
    "alt": "Две сотрудницы сверяют список на бумаге у складских стеллажей",
    "position": "50% 42%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 853
  },
  "peak-pallet-capacity": {
    "photographer": "Freek Wolsink",
    "source": "https://www.pexels.com/photo/industrial-warehouse-with-stacked-cardboard-boxes-34221998/",
    "alt": "Складской зал с высокими штабелями картонных коробок",
    "position": "50% 50%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 853
  },
  "storage-cost": {
    "photographer": "Handi Boyz LLC",
    "source": "https://www.pexels.com/photo/stacks-of-cardboard-boxes-5775099/",
    "alt": "Проход между рядами коробок на складе",
    "position": "50% 50%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 853
  },
  "warehouse-move": {
    "photographer": "Caleb Oquendo",
    "source": "https://www.pexels.com/photo/forklift-operators-loading-pallets-on-truck-34585120/",
    "alt": "Погрузчики перемещают паллеты рядом с грузовым прицепом",
    "position": "50% 57%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 854
  },
  "first-delivery": {
    "photographer": "Tima Miroshnichenko",
    "source": "https://www.pexels.com/photo/a-man-inspecting-parcels-on-a-shelves-6170405/",
    "alt": "Сотрудник осматривает коробки на складском стеллаже",
    "position": "50% 57%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 854
  },
  "dispatch-slots": {
    "photographer": "Juan R. Real",
    "source": "https://www.pexels.com/photo/warehouse-with-delivery-truck-exiting-the-loading-dock-29786116/",
    "alt": "Белый грузовик выезжает из погрузочной зоны склада",
    "position": "50% 46%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 854
  },
  "compare-fulfillment": {
    "photographer": "Kampus Production",
    "source": "https://www.pexels.com/photo/close-up-of-person-packing-an-order-into-a-cardboard-box-7857523/",
    "alt": "Руки укладывают товар в картонную коробку для отправки",
    "position": "50% 50%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 854
  },
  "returns": {
    "photographer": "Kaboompics",
    "source": "https://www.pexels.com/photo/man-unpacking-a-package-6958455/",
    "alt": "Руки вынимают товар из открытой картонной посылки с бумажным наполнителем",
    "position": "47% 51%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 854
  },
  "own-vs-outsourced": {
    "photographer": "Tiger Lily",
    "source": "https://www.pexels.com/photo/workers-walking-along-aisle-in-warehouse-4487383/",
    "alt": "Два сотрудника с коробкой в проходе между складскими стеллажами",
    "position": "50% 56%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 854
  },
  "choose-operator": {
    "photographer": "Tiger Lily",
    "source": "https://www.pexels.com/photo/men-standing-in-a-warehouse-talking-4480984/",
    "alt": "Трое сотрудников обсуждают работу рядом со складскими стеллажами",
    "position": "35% 52%",
    "smallWidth": 640,
    "smallHeight": 427,
    "largeWidth": 1280,
    "largeHeight": 854
  }
};

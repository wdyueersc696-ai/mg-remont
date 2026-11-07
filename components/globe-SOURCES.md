# Данные географического блока

`globe-land.json` содержит 4119 точек суши в формате `[долгота × 100, широта × 100, …]`.
Точки равномерно распределены по широтным поясам с шагом 1,7° и проверены на попадание в полигоны Natural Earth 1:110m Land. Континенты не нарисованы вручную. Проекция, Canvas renderer и визуальное оформление написаны для этого проекта.

- Исходные данные: [Natural Earth 1:110m Land](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson).
- Лицензия: [Natural Earth Terms of Use](https://www.naturalearthdata.com/about/terms-of-use/) — public domain, допускаются адаптация и коммерческое использование.
- Исходный JSON: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson
- Дата получения: 7 ноября 2026.

Визуальная механика изучена на [Iventions](https://iventions.com/) и в его [публичном JS географической сцены](https://iventions.com/_next/static/chunks/6685.bfd06db752d1c7d6.js): белый точечный глобус, медленное вращение, вертикальный автоскролл географических названий. Их географическая текстура и исходные фирменные изображения не входят в приложение.

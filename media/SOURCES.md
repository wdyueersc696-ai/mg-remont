# Источники медиа MG Ремонт

Подготовлено 7 ноября, обновлено 8 ноября 2026. Фотографические и видеоисточники — публикации Максима Гуревича. Временные ссылки CDN не используются. В v4 и v5 встроенный imagegen использован для удаления отдельных надписей. В v5 по прямому запросу пользователя создана ИИ-концепция интерьера для карточки 73 м²; она явно подписана. Полные сведения о v5 и промпты: [PROVENANCE-v5.md](./PROVENANCE-v5.md). В v6 заставка заменена полным оригинальным роликом: [PROVENANCE-v6.md](./PROVENANCE-v6.md).

| Файл | Источник | Происхождение |
| --- | --- | --- |
| hero.mp4 | https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/ | Полный оригинальный ролик с 0 с, 58,56 с, H.264 1080×1920, 25 fps, без аудио, faststart. Дополнительного фотомонтажа нет; авторские склейки сохранены. |
| hero-first-frame.jpg | https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/ | Точный первый кадр ролика: Максим перед домом. 1080×1920. Используется как постер до начала видео. Старый hero.jpg (кадр кухни) больше не используется. |
| house.jpg | https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/ | Тот же кадр 24 с. |
| house-detail.jpg | https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/ | Кадр 27,4 с, столовая и люстра, 1080×1920, без встроенного текста. |
| design.jpg | https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/ | Кадр 33,2 с: лестница в готовом доме, 1080×1920, без встроенного текста. Это тот же дом 210 м², не отдельный проект. |
| house.mp4 | https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/ | Полный обзор готового дома, около 58,6 с. Перекодирован в H.264 720×1280, AAC; оригинальный аудиопоток восстановлен из этой же публикации. |
| details.jpg | https://www.instagram.com/mg_remont/p/DdMoW15jhGL/ | Фотография раскладки плитки крупным планом из карусели автора, 1080×1440, без текста. |
| maxim.jpg | https://www.instagram.com/mg_remont/p/DdMoW15jhGL/ | Фотография Максима с бордовой плиткой, 1080×1440, без текста. |
| apartment.mp4 | https://www.instagram.com/mg_remont/reel/DPoreZGiCmr/ | Полный обзор квартиры 73 м² в районе ЗИЛ на этапе ремонта, около 59,7 с. H.264 720×1280, AAC; аудио из той же публикации. |
| apartment.jpg | https://www.instagram.com/mg_remont/reel/DPoreZGiCmr/ | Кадр 59,5 с того же объекта: коридор в процессе ремонта, 1080×1920, без текста. |

## Данные проектов

- Дом: по подписи автора 210 м², 8 месяцев работ, четыре мастер-спальни, кухня-гостиная с камином, финская сауна. Видео визуально показывает завершённый интерьер. Посёлок и точный адрес не установлены.
- Квартира: по подписи автора 73 м², Москва, район ЗИЛ, срок 3 месяца. На видео ремонт ещё идёт, поэтому объект необходимо обозначать как «В работе», а не завершённый проект.
- Фотографии `details.jpg` и `maxim.jpg` относятся к отдельной карусели о плиточных работах; не приписывать их дому 210 м² или квартире 73 м².
- Ролик квартиры 63 м² не был скачан. `details.mp4` и `details-project.jpg` отсутствуют.

## Проверка

Три MP4 полностью декодированы FFmpeg без ошибок. Hero не содержит аудиодорожку; полные обзоры содержат AAC-аудио. Субъективное прослушивание и оценка синхронизации не выполнялись. Исходные фотографии версий v1–v3 извлечены или скопированы без ретуши и без удаления надписей; отобраны кадры, в которых надпись отсутствовала в исходном видео.

Обновление hero: все три исходных кадра осмотрены в полном разрешении. Проверены начало, середина, конец, переходы и возврат цикла по девяти кадрам результата; встроенных слов нет. Новый hero полностью декодирован без ошибок. Исходные кадры 28,0 с и 41,0 с исключены из hero, поскольку при проверке в полном разрешении на них обнаружены субтитры.

## Замена фотографий v4

| Файл | Источник | Происхождение и использование |
| --- | --- | --- |
| service-apartments.png | https://www.instagram.com/mg_remont/reel/DO6bYvxiB1q/ | 18,00 с, гостиная готовой квартиры 34 м². Исходник 720×1280; imagegen удалил только наложенное слово «кварц», результат 941×1672. Для общей услуги «Квартиры»; не приписывать объекту 73 м². На сайте кадр слегка увеличен средствами CSS. |
| service-houses.jpg | https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/ | 8,60 с, фасад дома 210 м², 1080×1920, без субтитров и ретуши. Заменяет люстру в услуге «Дома». |
| service-design.jpg | https://www.instagram.com/mg_remont/reel/DP9QaUGiDOt/ | 19,60 с, визуализация спальни в публикации о квартире 58 м², 720×1280. Подписана «Визуализация проекта». Не фотография законченного ремонта. |
| apartment-73-view.jpg | https://www.instagram.com/mg_remont/reel/DPoreZGiCmr/ | 0,00 с, вид из той же квартиры 73 м² на набережную, 1080×1920. Без субтитров и ретуши. В сцене цифр подпись явно описывает вид из квартиры и ремонт в процессе. Пользователь отказался от санузла и попросил сохранить объект 73 м². |
| house-master-bedroom.jpg | https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/ | 38,30 с, одна из четырёх мастер-спален дома 210 м², 1080×1920, без субтитров и ретуши. |

`house.jpg` и фото дома 210 м² в сцене цифр оставлены без изменений. Отклонённый пользователем кадр санузла на сайт не включён.

Встроенный imagegen, финальный промпт для `service-apartments.png`:

> Edit target: the supplied real renovation photograph. Remove ONLY the overlaid subtitle word «кварц» and its shadow. Restore the exact underlying texture in this tiny text area. Preserve the entire real photograph otherwise unchanged: camera angle, framing, proportions, exposure, color balance, furniture, walls, seams, tile, windows, objects, any people or partial people. No new objects. No redesign, no beautification, no restyling, no lighting changes, no upscaling inventions. This is a factual portfolio photograph; minimal subtitle removal only. Keep the original 9:16 portrait framing. Output one cleaned photograph.

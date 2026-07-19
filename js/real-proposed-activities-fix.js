document.addEventListener('DOMContentLoaded', function () {
      const activityOptionsByDay = {
        'day-1': [
          ['First choice','Kamilari village walk','kamilari-walk','Gentle arrival-day orientation walk close to the apartment.','A short local walk through Kamilari to understand the village layout, nearby tavernas, parking and useful shops after arrival.','Recommended because arrival days are unpredictable. It keeps the first evening low-stress, low-cost and close to the apartment.','Village streets, local tavernas, views across the Messara plain and the first relaxed feeling of South Crete.','Buy water and breakfast items first, then keep the walk short and easy.','Use this first evening to identify parking, groceries, the easiest route back to the apartment and one reliable nearby dinner option.'],
          ['Alternative','Kalamaki sunset','kalamaki-beach','Short coastal sunset outing if arrival was smooth.','A quick drive to Kalamaki for a first sea view, sunset and simple seaside atmosphere.','Good if the flight, car pickup and check-in were easy and everyone still has energy.','Long beach, sunset light, seaside tavernas and a relaxed first contact with the Libyan Sea.','Skip this if arrival is delayed or anyone is tired.','This option gives an immediate holiday feeling but should remain optional.'],
          ['Alternative','Pitsidia dinner','kamilari-walk','Nearby village dinner with a little more atmosphere.','A nearby village dinner option with more restaurant choice while still staying close to Kamilari.','Useful if Kamilari feels too quiet on the first evening and the family wants more atmosphere without a long drive.','Village square, tavernas and simple local evening life.','Go after 19:00 when it is cooler.','Keep this as a food-focused alternative: dinner, short walk and back to the apartment.']
        ],
        'day-2': [
          ['First choice','Kommos Beach','kommos-beach','Natural beach close to Kamilari for the first full day.','A wide, natural beach with open coastline, space to relax and possible calm-water swimming/snorkeling.','Recommended because it is close, low-cost and ideal for easing into the trip without overplanning.','Long sandy beach, natural coastline, open sea views and a quieter atmosphere than busier beach villages.','Bring shade, water and snacks because the beach can feel exposed.','Arrive early, swim if the sea is calm, then leave before peak heat for lunch and apartment rest.'],
          ['Alternative','Kalamaki Beach','kalamaki-beach','Easier beach with food and facilities nearby.','A more convenient beach option with tavernas, toilets and easier family logistics close by.','Better if the family wants comfort, food access and easier services rather than a more natural beach.','Sandy beach, cafés, tavernas and a relaxed seaside village setting.','Good for late afternoon and dinner after 17:00.','Use Kalamaki when convenience matters more than wild scenery or when Kommos feels too windy.'],
          ['Alternative','Matala Village and Beach','matala-evening','Livelier beach village with caves, shops and restaurants.','A classic South Crete village/beach option with visible caves, restaurants and a more touristy atmosphere.','Good if the family wants more than a beach day and prefers a lively village with things to see.','Matala bay, caves from the beach, colorful streets, shops and restaurants.','Choose this later in the afternoon if the heat is strong.','This makes the day more active and atmospheric than Kommos or Kalamaki, but it may be busier.']
        ],
        'day-3': [
          ['First choice','Matala Caves','matala-evening','Iconic cave and beach setting with village atmosphere.','A visit to Matala’s famous cliff caves and the surrounding beach village.','Recommended because it combines culture, short exploration, sea views and a memorable setting for the kids.','Cave cliffs, Matala beach, colorful streets, murals, shops and food options.','Go early for the caves, then decide whether to swim or explore the village.','Do the caves before the strongest heat, then use the rest of Matala as flexible beach/village time.'],
          ['Alternative','Kommos Beach sunset','kommos-beach','Quieter coastal alternative if Matala feels too busy.','A relaxed beach alternative with wide open views and less village activity.','Useful if Matala is too crowded or the family wants a quieter beach experience.','Open coastline, sunset possibilities and broad natural beach scenery.','Check wind before choosing this option.','This keeps the day simple and scenic while avoiding the busier Matala atmosphere.'],
          ['Alternative','Kalamaki dinner by the sea','kalamaki-beach','Easy evening option with food close to the beach.','A comfortable food-and-sea alternative focused on dinner near the coast.','Good if the family wants an easy evening without more sightseeing.','Beachfront tavernas, sea views and relaxed evening atmosphere.','Use it after apartment rest, not during peak heat.','This still feels like a holiday evening without requiring much effort.']
        ],
        'day-4': [
          ['First choice','Phaistos Palace','phaistos-palace','Major Minoan palace site close to Kamilari.','An important Minoan palace site with wide views over the Messara plain and strong historical value.','Recommended because it is close, culturally important and easier than a full Heraklion or Knossos day.','Ancient courtyards, palace remains, stone structures, stairways and panoramic views over the plain.','Visit early and bring hats and water because shade is limited.','Keep the visit focused: explain the Minoan palace story, enjoy the views and return for lunch/rest before the heat becomes too strong.'],
          ['Alternative','Agia Triada Archaeological Site','agia-triada','Smaller nearby archaeological add-on.','A quieter Minoan archaeological site near Phaistos that can add context to the palace landscape.','Good if the family is still interested in archaeology and the weather is manageable.','Compact ruins, countryside setting and a quieter historic atmosphere than Phaistos.','Only add this if Phaistos finishes early and everyone still has energy.','Agia Triada should enrich the history day, not make it too heavy. Skip it if heat or fatigue is building.'],
          ['Alternative','Matala village later in the day','matala-evening','Beach village option after culture and rest.','A late-day Matala visit for sea views, village atmosphere, restaurants and the caves backdrop.','Good if the family wants a cultural morning and a more relaxed coastal evening.','Matala beach, cave cliffs, shops, restaurants and sunset atmosphere.','Go after apartment rest when the heat drops.','This pairing works well: Phaistos early, rest during heat, Matala as the evening reward.']
        ],
        'day-5': [
          ['First choice','Ancient Gortyna','gortyna','Roman and ancient site in the Messara region.','An important ancient city site that adds Roman and law-code history to the trip.','Recommended because it broadens the cultural story beyond Minoan palaces and stays within a realistic drive.','Outdoor ruins, inscriptions, Roman-era remains and archaeological structures.','Go in the morning and keep the visit concise.','Use this as a focused cultural stop, then combine with lunch or a practical town stop before rest.'],
          ['Alternative','Zaros Lake','zaros-lake','Cooler inland nature option if culture feels too much.','A peaceful lake and village area in the foothills with a short walk and food options.','Good if the family wants nature and cooler scenery instead of another archaeological site.','Lake views, trees, mountain atmosphere and local tavernas.','Go morning or late afternoon and keep the walk short.','Zaros gives variety and a quieter rhythm after several coastal or cultural days.'],
          ['Alternative','Kommos Beach','kommos-beach','Simple beach fallback close to Kamilari.','A flexible beach option when archaeology or driving feels too much.','Useful because it keeps the day low-cost and easy to adjust.','Open coastline, sea views and sunset potential.','Check wind and bring shade.','Kommos keeps the day enjoyable without forcing another cultural stop.']
        ],
        'day-6': [
          ['First choice','Agiofarago Gorge','agiofarago','Short dramatic gorge walk with a wild beach reward.','A nature adventure through a dramatic gorge leading toward a remote-feeling beach.','Recommended because it matches nature, adventure and short-walk preferences.','Rock walls, goats, rugged scenery and a wild beach at the end.','Start very early, bring water, proper shoes and snacks.','Treat this as a premium nature day. If heat, wind or road conditions are not good, choose a softer alternative.'],
          ['Alternative','Matala Beach and village','matala-evening','Comfortable backup with beach, food and facilities.','A safer and easier coastal alternative with restaurants, shops and beach access.','Right alternative if Agiofarago feels too hot, remote or difficult on the day.','Matala bay, cave cliffs, village streets and restaurants.','Use this without feeling the day failed; it is still a strong South Crete experience.','Matala protects the day from weather or energy issues while still giving the family a memorable outing.'],
          ['Alternative','Kommos Beach','kommos-beach','Low-cost natural beach alternative close to base.','A simpler natural beach day with less driving and more flexibility.','Useful if the family wants to stay closer to Kamilari while still enjoying a scenic beach.','Open sea, long beach, natural coastline and sunset potential.','Check wind and bring shade.','Kommos is the low-stress fallback when the main adventure feels too much.']
        ],
        'day-7': [
          ['First choice','Zaros Lake','zaros-lake','Cooler inland lake walk and village food.','A peaceful lake and village area in the foothills, good for a short nature walk and lunch.','Recommended because it gives a cooler inland contrast to beach days and fits the short-walk preference.','Lake views, trees, mountain scenery and tavernas nearby.','Use this as a reset day after busier coastal or cultural days.','Keep the walk flexible and focus on scenery, lunch and a calmer rhythm.'],
          ['Alternative','Gortyna archaeological site','gortyna','Culture alternative if the family wants history.','An ancient site offering a different historical period from the Minoan palace sites.','Good alternative if the family prefers culture over inland nature on the day.','Outdoor ruins, inscriptions and Roman-era remains.','Only choose this early morning because it is exposed.','Use it as a short focused cultural visit rather than a long museum-style day.'],
          ['Alternative','Kommos sunset','kommos-beach','Easy evening beach alternative after a quiet day.','A short late-day beach option close to Kamilari.','Useful if the family wants to add a simple sea moment after a rest-heavy day.','Open beach, sunset light and natural coastline.','Go after 17:00 and keep it simple.','A short sunset visit can make a quiet day feel complete without adding pressure.']
        ]
      };

      const fallback = [
        ['First choice','Kommos Beach','kommos-beach','Natural beach option close to Kamilari.','A spacious beach with natural scenery and possible calm-water swimming.','Recommended because it is close, low-cost and flexible.','Open coastline, sea views and quiet beach space.','Check wind and bring shade.','Use Kommos as the default simple beach option when the plan needs flexibility.'],
        ['Alternative','Kalamaki Beach','kalamaki-beach','Convenient serviced beach option.','A beach with nearby food and easier family logistics.','Useful when comfort and facilities matter more than wild scenery.','Beach, cafes and tavernas.','Good later in the afternoon.','Kalamaki is the practical fallback beach.'],
        ['Alternative','Matala Village and Beach','matala-evening','Livelier village, caves and beach.','A classic South Crete village/beach experience.','Useful if the family wants more atmosphere and food options.','Beach, cave cliffs, shops and restaurants.','Go later in the day.','Matala adds atmosphere but can be busier.']
      ];

      function optionArrayToObject(arr) {
        return { tag: arr[0], title: arr[1], activityId: arr[2], short: arr[3], what: arr[4], why: arr[5], see: arr[6], tip: arr[7], full: arr[8] };
      }

      function getOptions(dayCard) {
        return (activityOptionsByDay[dayCard.id] || fallback).map(optionArrayToObject);
      }

      function applyOptionToButton(button, option) {
        button.dataset.tag = option.tag;
        button.dataset.title = option.title;
        button.dataset.activityId = option.activityId;
        button.dataset.short = option.short;
        button.dataset.what = option.what;
        button.dataset.why = option.why;
        button.dataset.see = option.see;
        button.dataset.tip = option.tip;
        button.dataset.full = option.full;
        const tagEl = button.querySelector('.option-tag') || button.querySelector('span');
        const titleEl = button.querySelector('strong');
        const shortEl = button.querySelector('small');
        if (tagEl) tagEl.textContent = option.tag;
        if (titleEl) titleEl.textContent = option.title;
        if (shortEl) shortEl.textContent = option.short;
      }

      function selectedClassFromTag(tagText) {
        const value = String(tagText || '').toLowerCase();
        if (value.includes('alternative')) return 'selected-alternative';
        if (value.includes('extra')) return 'selected-extra-time';
        return 'selected-first-choice';
      }

      function updatePanel(button) {
        const dayCard = button.closest('.day-card');
        if (!dayCard) return;
        const panel = dayCard.querySelector('.selected-activity-panel');
        const grid = button.closest('.activity-options-grid');
        if (!panel) return;
        if (grid) {
          grid.classList.add('has-selection');
          grid.querySelectorAll('.activity-option').forEach(option => option.classList.toggle('active', option === button));
        }
        dayCard.classList.remove('selected-first-choice', 'selected-alternative', 'selected-extra-time');
        dayCard.classList.add(selectedClassFromTag(button.dataset.tag));
        const mapping = {
          '.selected-tag': button.dataset.tag,
          '.selected-title': button.dataset.title,
          '.selected-short': button.dataset.short,
          '.selected-what': button.dataset.what,
          '.selected-why': button.dataset.why,
          '.selected-see': button.dataset.see,
          '.selected-tip': button.dataset.tip,
          '.selected-full': button.dataset.full
        };
        Object.keys(mapping).forEach(selector => {
          const el = panel.querySelector(selector);
          if (el) el.textContent = mapping[selector] || '';
        });
        const activityId = button.dataset.activityId || '';
        const link = activityId ? 'activities.html?open=details&activity=' + encodeURIComponent(activityId) + '#' + encodeURIComponent(activityId) : 'activities.html';
        panel.querySelectorAll('.activity-page-link, .activity-page-link-2').forEach(anchor => anchor.href = link);
      }

      document.querySelectorAll('.day-card').forEach(dayCard => {
        const options = getOptions(dayCard);
        const buttons = Array.from(dayCard.querySelectorAll('.activity-option'));
        buttons.forEach((button, index) => {
          applyOptionToButton(button, options[index] || options[0]);
          button.classList.toggle('active', index === 0);
        });
        if (buttons[0]) updatePanel(buttons[0]);
      });

      document.addEventListener('click', function (event) {
        const button = event.target.closest('.activity-option');
        if (!button) return;
        setTimeout(() => updatePanel(button), 0);
      });
    });

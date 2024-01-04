jamis = User.create!(email_address: 'jamis@jamisbuck.org',
                     display_name: 'Jamis Buck',
                     description: 'I write stories based on solo RPG actual plays. Ironsworn, SWADE, DungeonWorld, and many others!',
                     creator: true,
                     password: 'password',
                     password_confirmation: 'password')

story = jamis.stories.create!(
          title: 'An Ironsworn Actual Play',
          subtitle: nil,
          description: 'This is just me, playing Ironsworn. I\'ll update this description when I know more about where the story is going.',
          archived_at: Time.now)

setup = story.chapters.create!(published_at: Time.now, title: 'Session Zero')
beginning = story.chapters.create!(published_at: Time.now, title: 'Chapter One')
story.update setup: setup, beginning: beginning

setup.sections << Section.new(position: 1, contents: <<~CONTENTS)
  The main character will be named *Wulan*. I picture him as a big, \
  hulking thing, all muscle. He's gruff and distant to most people, \
  intimidating and off-putting. He's not unintelligent, but his effort \
  and time have gone into martial prowess, not intellectual skill.

  His stats will be:

  * **Edge**: 2
  * **Heart**: 2
  * **Iron**: 3
  * **Shadow**: 1
  * **Wits**: 1

  Wulan starts with health, spirit, and supply at 5, and momentum at 2.

  He has the following assets:

  * **Swordmaster**. "When you *Strike* or *Clash* and burn momentum to improve \
    your result, inflict +2 harm. If the fight continues, add +1 on your
    next move."
  * **Wright**. "When you *Secure an Advantage* by crafting a useful \
    item using your specialty [Blacksmithing], or when you *Face Danger* \
    to create or repair an item in a perilous situation, add +1 and take +1
    momentum on a hit."
  * **Commander**. "You lead a warband with +4 strength." Can use them for \
    *Face Danger*, *Secure an Advantage*, *Compel*, or *Battle*.

  I think his warband is called "Wulan's Blade."

  His three starting bonds:

  * His sister, Nia. She is married to a fisherman in a village on the \
    Ragged Coast. Wulan visits as often as he is able, and though he has \
    always been reserved, he is a favorite with his nieces and nephews.
  * (let's leave the other two for now, and fill them in as we discover \
    his history)

  Let's save his background vow as well, and see what that might be.

  We'll choose our truths at random:

  ## The Old World

  "The sickness moved like a horrible wave across the Old World..." Wulan's
  ancestors came to the Ironlands to escape a plague that devastated the old
  kingdoms.

  ## Iron

  "Inscrutable metal pillars are found throughout the land." Folk call them
  "iron fingers", though they never tarnish or rust. Some, like the Iron Priests,
  "worship them and swear vows upon them." Most do not trust them.

  ## Legacies

  "Other humans sailed here from the Old World untold years ago, but all
  that is left of them is a savage, feral people we call the broken."

  ## Communities

  "We are few in number in this accursed land. Most rarely have contact with
  anyone outside our own small steading or village, and strangers are
  viewed with deep suspicion."

  ## Leaders

  "Numerous clan-chiefs rule over petty domains. Most are intent on becoming
  the one true king. Their squabbles will be our undoing."

  ## Defense

  "Supplies are too precious, and the lands too sparsely populated, to support
  organized fighting forces. When a community threatened, the people stand together
  to protect their own."

  ## Mysticism

  "Magic is rare and dangerous, but those few who wield the power are
  truly gifted."

  ## Religion

  "A few Ironlanders still make signs or mumble prayers out of habit or
  tradition, but most believe the gods long ago abandoned us."

  ## Firstborn

  "The Firstborn hold sway in the Ironlands. The elves of the deep forests
  and the giants of the hills tolerate us and even trade with us."

  ## Beasts

  "Beasts of all sorts roam the Ironlands. They dwell primarily in the reaches,
  but range into settled lands to hunt."

  ## Horrors

  "We are wary of dark forests and deep waterways, for monsters lurk in
  those places. In the depths of the long-night...only fools venture beyond
  their homes."
CONTENTS

setup.actions.create prompt: "Start chapter one", target: beginning

beginning.sections << Section.new(position: 1, contents: <<~CONTENTS)
  I dine with my warband this night. They are raucous and coarse, as \
  usual, and usually I am ready enough to join in their revelries, but \
  tonight...

  I dine with my warband this night, but my mind is miles and \
  miles away, in the Ragged Coast.
CONTENTS

beginning.sections << Section.new(position: 2, role: 'secondary', contents: <<~CONTENTS)
  Wups. I need a name for Wulan's lieutenant. Rolling on the oracle, I \
  get 9, "Artiga." What's he like? Oracle again! Role is "refute a \
  falsehood." Descriptor is 90 = "fervent."

  Might as well roll up a couple others for the warband, too. Kuron, who is \
  apparently "infamous," and Valeri, who is "wary."
CONTENTS

beginning.sections << Section.new(position: 3, contents: <<~CONTENTS)
  "Wulan!" shouts Artiga, my lietenant. He is a fiercely intense man, \
  most times, but in moments such as these he manages to become one of \
  the most bacchanalian of revelers. "Wulan!" he shouts again, as he \
  staggers, drunken, to my side. "Come! Join us! Kuron promises to sing \
  the Lay of Sidan again."

  I am tempted, not because Kuron sings particularly well, but because \
  the *last* time he sang that lay, we laughed until we had no breath left in us. \
  The man has a voice like a rock toad in the best of times, \
  and when he's drunk his talent declines yet farther.

  "I'll be there soon," I say, knowing that I'm probably lying, but there's \
  no graceful way to decline a drunk man's invitation. It suffices to put \
  Artiga off, though, and I watch as he staggers back to the fire with the \
  others.

  My mind turns again to the Ragged Coast, and to Nia, my sister who lives there \
  with her family. I have had troubling word from her just this afternoon. She cannot \
  write--which makes no difference since I cannot read--but a troubadour \
  found me today, and he had been in her village. He could not stay, alas, or our \
  entertainment would be far better than Kuron's rendering of "the Lay of Sidan," \
  but he said that my sister had been asking for news of me, for many months, and \
  had bid all minstrels that found me to bid me find her in return.

  This is a difficult request. My men are comfortable here, in the Havens. We've \
  made a reputation for ourselves among the villages hereabouts, and the people are \
  quick to share their provisions with us in exchange for a bit of security from \
  the bandits--and worse--that have tried to prey upon them.
CONTENTS

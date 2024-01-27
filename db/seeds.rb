jamis = User.create!(email_address: 'jamis@jamisbuck.org',
                     display_name: 'Jamis Buck',
                     description: 'I write stories based on solo RPG actual plays. Ironsworn, SWADE, DungeonWorld, and many others!',
                     creator: true,
                     password: 'password',
                     password_confirmation: 'password')

reader = User.create!(email_address: 'reader@elsewhere.com',
                     display_name: 'Reader Joe',
                     password: 'password',
                     password_confirmation: 'password')

tracker = {}

story = jamis.stories.create!(
          title: "Wulan's Blade",
          subtitle: 'An Ironsworn Actual-Play',
          description: 'This is just me, playing Ironsworn. I\'ll update this description when I know more about where the story is going.',
          interactive: true)

setup = story.chapters.create!(published_at: Time.now, title: 'Session Zero', interactive: true)

setup.sections << Section.new(role: 'full',
  track_sheet_update_attributes: {
    definition: [ { 'action' => 'add',
      'parent' => [ 'Wulan' ],
      'child' => {
        'Stats' => {
          'Edge' => { '_type' => 'int', 'value' => 2 },
          'Heart' => { '_type' => 'int', 'value' => 2 },
          'Iron' => { '_type' => 'int', 'value' => 3 },
          'Shadow' => { '_type' => 'int', 'value' => 1 },
          'Wits' => { '_type' => 'int', 'value' => 1 }
        },
        'Resources' => {
          'Health' => { '_type' => 'int', 'value' => 5 },
          'Spirit' => { '_type' => 'int', 'value' => 5 },
          'Supply' => { '_type' => 'int', 'value' => 5 },
          'XP' => { '_type' => 'int', 'value' => 0 },
        },
        'Momentum' => {
          'Current' => { '_type' => 'int', 'value' => 2 },
          'Reset' => { '_type' => 'int', 'value' => 2 },
          'Min' => { '_type' => 'int', 'value' => 2 },
        },
        'Debilities' => {
          'Conditions' => {
            'Wounded' => { '_type' => 'bool', 'value' => false },
            'Unprepared' => { '_type' => 'bool', 'value' => false },
            'Shaken' => { '_type' => 'bool', 'value' => false },
            'Encumbered' => { '_type' => 'bool', 'value' => false },
          },
          'Banes' => {
            'Maimed' => { '_type' => 'bool', 'value' => false },
            'Corrupted' => { '_type' => 'bool', 'value' => false },
          },
          'Burdens' => {
            'Cursed' => { '_type' => 'bool', 'value' => false },
            'Tormented' => { '_type' => 'bool', 'value' => false },
          }
        }
      }
    } ]
  },
  contents: <<~CONTENTS.rstrip)
The main character will be named *Wulan*. I picture him as a big, \
hulking thing, all muscle. He's gruff and distant to most people, \
intimidating and off-putting. He's not unintelligent, but his effort \
and time have gone into martial prowess, not intellectual skill.

His stats will be:
CONTENTS

setup.sections << Section.new(role: 'full',
  track_sheet_update_attributes: {
    definition: [ { 'action' => 'add',
      'parent' => [ 'Wulan', 'Assets' ],
      'child' => {
        'Swordmaster' => { '_type' => 'card', 'value' => 'When you *Strike* or *Clash* and burn momentum to improve your result, inflict +2 harm. If the fight continues, add +1 on your next move.' },
        'Wright' => { '_type' => 'card', 'value' => 'When you *Secure an Advantage* by crafting a useful item using your specialty [Blacksmithing], or when you *Face Danger* to create or repair an item in a perilous situation, add +1 and take +1 momentum on a hit.' },
        'Commander' => { '_type' => 'card', 'value' => '"You lead a warband with +4 strength." Can use them for *Face Danger*, *Secure an Advantage*, *Compel*, or *Battle*.' },
      }
    } ]
  },
  contents: <<~CONTENTS.rstrip)
He has the following assets:
CONTENTS

setup.sections << Section.new(role: 'full', contents: <<-CONTENTS.rstrip)
I think his warband is called "Wulan's Blade."

His three starting bonds:

* His sister, Nia. She is married to a fisherman in a village on the \
Ragged Coast. Wulan visits as often as he is able, and though he has \
always been reserved, he is a favorite with his nieces and nephews.
* (let's leave the other two for now, and fill them in as we discover \
his history)

We'll discover his background vow later, as well (but hopefully soon).

Let's choose our truths at random:

## The Old World

"The sickness moved like a horrible wave across the Old World..." Wulan's \
ancestors came to the Ironlands to escape a plague that devastated the old \
kingdoms.

## Iron

"Inscrutable metal pillars are found throughout the land." Folk call them \
"iron fingers", though they never tarnish or rust. Some, like the Iron Priests, \
"worship them and swear vows upon them." Most do not trust them.

## Legacies

"Other humans sailed here from the Old World untold years ago, but all \
that is left of them is a savage, feral people we call the broken."

## Communities

"We are few in number in this accursed land. Most rarely have contact with \
anyone outside our own small steading or village, and strangers are \
viewed with deep suspicion."

## Leaders

"Numerous clan-chiefs rule over petty domains. Most are intent on becoming \
the one true king. Their squabbles will be our undoing."

## Defense

"Supplies are too precious, and the lands too sparsely populated, to support \
organized fighting forces. When a community threatened, the people stand together \
to protect their own."

## Mysticism

"Magic is rare and dangerous, but those few who wield the power are \
truly gifted."

## Religion

"A few Ironlanders still make signs or mumble prayers out of habit or \
tradition, but most believe the gods long ago abandoned us."

## Firstborn

"The Firstborn hold sway in the Ironlands. The elves of the deep forests \
and the giants of the hills tolerate us and even trade with us."

## Beasts

"Beasts of all sorts roam the Ironlands. They dwell primarily in the reaches, \
but range into settled lands to hunt."

## Horrors

"We are wary of dark forests and deep waterways, for monsters lurk in \
those places. In the depths of the long-night...only fools venture beyond \
their homes."
CONTENTS

setup.comments.create!(user: reader, contents: <<~COMMENT)
  I'm so excited! I can't wait to see where this goes. Ironsworn is,
  like, my favorite RPG. So much flavor!
COMMENT

beginning = setup.add_sequel(
              action: { prompt: "The story begins" },
              chapter: { title: 'Chapter One', interactive: false })

beginning.scratch_pad.update(contents: <<~CONTENTS)
  Lieutenant: Artiga (fevant, "refute a falsehood")

  Other members of the band:
  * Kuron ("infamous", terrible singer)
  * Valeri ("wary")
CONTENTS

beginning.sections << Section.new(contents: <<-CONTENTS.rstrip)
I dine with my warband this night. They are raucous and coarse, as \
usual, and usually I am ready enough to join in their revelries, but \
tonight...

I dine with my warband this night, but my mind is on the Ragged Coast, \
miles and miles away.
CONTENTS

beginning.sections << Section.new(role: 'right', contents: <<-CONTENTS.rstrip)
Wups. I need a name for Wulan's lieutenant. Rolling on the oracle, I \
get 9, "Artiga." What's he like? Oracle again! Role is "refute a \
falsehood." Descriptor is 90 = "fervent."

Might as well roll up a couple others for the warband, too. Kuron, who is \
apparently "infamous," and Valeri, who is "wary."
CONTENTS

beginning.sections << Section.new(contents: <<-CONTENTS.rstrip)
"Wulan!" shouts Artiga, my lieutenant. He is a fiercely intense man, \
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

It is a puzzle. I haven't seen Nia in years--not since the birth of her first \
child--but we were inseparable as children, and I swore that I would always \
be there for her.
CONTENTS

beginning.sections << Section.new(role: 'right', contents: <<-CONTENTS.rstrip)
Hmmm! I don't think this is the background vow, though. It's too general. It's not \
even a good fit for the "inciting incident" vow. I actually don't think this is anything \
to do with an actual "iron vow." It's just a thing he told her when they were children.

Which, of course, does not diminish at all what it means to Wulan.
CONTENTS

beginning.sections << Section.new(contents: <<-CONTENTS.rstrip)
I could go by myself, leaving my men in Artiga's care, but that doesn't sit \
right with me. The people here call them "Wulan's Blade" for a reason, and \
though they might follow Artiga for a time, they need *me*.

And, frankly, I need them.

So, do I command them to follow me to the Ragged Coast? They would come, \
and they would even come willingly. But Ironlanders are a suspicious lot, \
by and large, and a band of armed men would not sit comfortably with most \
settlements. A dozen men eat a lot, and unless they are kept busy, they \
also cause a lot of mischief. Villages would not welcome such company willingly.

Not for the first time, my mind turns to the reason for Nia's call. The \
minstrel knew nothing of her purpose. In fact, he said she seemed well \
enough when he was there just a month ago. Her need must not be urgent, then, \
but still...

She asks for *me*. My sister needs *me*.

I rise in the morning, having slept little, and stomp feeling back into \
my legs and feet. The air is chilly, but holds the promise of a warm day \
in its snap.

"Artiga!" I call as I walk through the camp. My men grump and look at me \
blearily, obviously the worse for drink. Artiga sits up abruptly and groans, \
holding a hand to his head.

"Wulan?" he mumbles. "Is something wrong?"

I go to his bedroll and drop to one knee. "I've made a decision," I say, \
"and I want you to witness my oath."

Artiga licks his lips and squints at me. "Your oath? For what?"

"I'm taking us to the Ragged Coast," I say, "to answer my sister's call. \
I would swear an oath that I will do whatever is in my power to aid her."

"The Ragged Coast, though?" Artiga looks horrified. "What about the people \
here?"

I nod. I've thought long about this. "I will stay here for two more weeks, \
organizing the people so that they can defend themelves. They will \
survive."

Artiga hesitates, but nods. "You're serious?"

"Very."

"I will witness your oath, then."

"Come."
CONTENTS

beginning.sections << Section.new(role: 'right', contents: <<-CONTENTS.rstrip)
Given the truths I rolled at the beginning, "iron" refers not to the metal, necessarily. \
Especially with regard to oath-swearing, "iron" refers to the mystical \
pillars. I think they are ubiquitous enough that they are no more than \
an hour away.
CONTENTS

beginning.sections << Section.new(contents: <<-CONTENTS.rstrip)
I tell the men that Artiga and I will be back later. There are some \
grumbles that I take for acknowledgment, and then we're off.

There is an Irondale an hour's walk from us, and we make for it. I tell \
Artiga about how I arrived at my decision, and ask for his council. He is \
not a particularly wise man, but he knows me well. He understands why I \
must do this thing.

"But Wulan," he says. "You've also sworn to protect the people of these \
lands. You have a responsibility to that oath, as well."
CONTENTS

beginning.sections << Section.new(role: 'right',
  track_sheet_update_attributes: { definition: [
    { 'action' => 'add',
      'parent' => [ 'Wulan', 'Vows' ],
      'child' => {
        'Protect the people of the Hinterlands' => {
          'Rank' => { '_type' => 'enum', 'enum' => [ 'Troublesome', 'Dangerous', 'Formidable', 'Extreme', 'Epic' ], 'value' => 'Epic' },
          'Progress' => { '_type' => 'string', 'value' => '0,0' }
        }
      }
    } ]
  },
  contents: <<-CONTENTS.rstrip)
Ah! There's the background oath. Wulan has sworn to protect the people of \
this area. We'll get more details as we go, but I suspect there's some force \
that has been threatening them, perhaps one of the Firstborn tribes?
CONTENTS

beginning.sections << Section.new(contents: <<-CONTENTS.rstrip)
"I will keep that oath," I say. "We will return, Artiga, and I will see \
to the people here in the Hinterlands. I've realized, though, that part \
of that oath is teaching them to defend themselves."

When we finally reach the Irondale, the sun is warm upon us and we are \
both glad to finally sit and rest a moment. Below us, in the dale, are \
four black metal spikes, each one as tall as several men. The largest is wide \
enough at its base that I cannot reach my arms around it. The smallest is \
as thick as my thigh.

Though we call this an "Irondale," the spikes are not truly iron. No man can \
dent them. No smith can work them. Though they are metal, they are hardy and \
impenetrable. We swear our oaths on them, that our determination may be as \
durable as these.

We make our way down the hill and stand among the spikes. Artiga nods and \
urges me to begin.

I place one hand on the spike and look to the sky, where the spike seems to \
point, and I speak the words...
CONTENTS

beginning.sections << Section.new(role: 'right',
  track_sheet_update_attributes: { definition: [
    { 'action' => 'update',
      'parent' => [ 'Wulan', 'Momentum' ],
      'child' => { 'Current' => 4 } }
    ]
  },
  contents: <<-CONTENTS.rstrip)
Okay, first roll of the game. Wulan will *Swear an Iron Vow*. Though his \
sister isn't present, this is for her, and he does share a bond with her, so he \
gets +1. The roll, +heart, +1: 6+2+1 = 9 vs 2, 6. That's a strong hit!

"It is clear what you must do next... Take +2 momentum." His momentum is at 4 now.
CONTENTS

beginning.sections << Section.new(role: 'right',
  track_sheet_update_attributes: { definition: [
    { 'action' => 'add',
      'parent' => [ 'Wulan', 'Vows' ],
      'child' => {
        'Find out what Nia needs, and help her' => {
          'Rank' => { '_type' => 'string', 'enum' => [ 'Troublesome', 'Dangerous', 'Formidable', 'Extreme', 'Epic' ], 'value' => 'Formidable' },
          'Progress' => { '_type' => 'int', 'value' => '0' }
        }
      }
    } ] },
  contents: <<~CONTENTS.rstrip)
He's got a new vow, now: "Find out what Nia needs, and help her." I'll  make this a Formidable quest.
CONTENTS

beginning.sections << Section.new(contents: <<-CONTENTS.rstrip)
With portentious weight, the oath settles into me. I nod, satisfied, \
knowing that I've chosen the right path for me, right now.

Artiga looks anxiously to me, and I nod again.

"It is done," I say. "Let us return and start making preparations."
CONTENTS

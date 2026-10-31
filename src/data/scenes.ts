import type { Scene } from '@features/scenario/types'

/** The 9 presenter scenes. Full scripts: docs/03-scenes-and-scripts.md */
export const SCENES: Scene[] = [
  {
    id: 'problem',
    number: 1,
    title: 'The problem',
    tab: 'The problem',
    headline: 'Where do your ad leads go missing?',
    minutes: 2,
    takeaway: 'The ads work. The leads leak after the click.',
    cues: [
      {
        id: 'spend',
        label: 'Show the money spent',
        notes: 'Open with the budget: PKR 15 lakh a month, 9 on Meta and 6 on Google. The ads are not the problem.',
      },
      {
        id: 'leads',
        label: 'Follow 100 leads',
        notes: 'Let each colour settle before you speak. Ask: which of these leaks do you see in your own team?',
      },
      {
        id: 'cost',
        label: 'What this costs',
        notes: 'Each sale costs PKR 2.5 lakh, and nobody knows which ad brought it. Pause here, then move to scene 2.',
      },
    ],
  },
  {
    id: 'launch',
    number: 2,
    title: 'Launch a campaign',
    tab: 'Launch',
    headline: 'One campaign, two platforms, every lead in one place.',
    minutes: 3,
    takeaway: 'Both campaigns send leads to one inbox, with the source attached.',
    cues: [
      {
        id: 'meta',
        label: 'Create the Meta campaign',
        notes: 'Objective Leads, Lahore audience, PKR 30,000 a day. Two formats: Click to WhatsApp and Instant form.',
      },
      {
        id: 'google',
        label: 'Create the Google campaign',
        notes: 'Search ads on the words buyers type, with a lead form, call button and WhatsApp link.',
      },
      {
        id: 'connect',
        label: 'Connect to the Lead Inbox',
        notes: 'This is the key point: both platforms feed the same inbox, and each lead keeps its campaign and ad.',
      },
      {
        id: 'publish',
        label: 'Publish both',
        notes: 'The clock now runs fast, so spend, reach and clicks climb. Move on once the numbers are moving.',
      },
    ],
  },
  {
    id: 'lead-arrives',
    number: 3,
    title: 'A lead arrives',
    tab: 'Lead arrives',
    headline: 'What happens in the first 10 seconds after a click?',
    minutes: 3,
    takeaway: 'Every lead gets a reply in seconds, with the source recorded.',
    cues: [
      { id: 'sees-ad', label: 'Sana sees the ad', notes: 'Sana scrolls her feed and stops on our ad. She taps “Send WhatsApp message”.' },
      { id: 'sends', label: 'She sends a message', notes: 'WhatsApp opens with the message ready. Watch the ticks: sent, delivered, read.' },
      {
        id: 'inbox',
        label: 'Lead lands in the inbox',
        notes: 'Point at the timer and the source box: campaign, ad and time are attached without anyone typing.',
      },
      { id: 'reply', label: 'Instant reply', notes: 'The reply goes out in 4 seconds, before a person could even open the chat. Usman is notified.' },
      {
        id: 'google',
        label: 'Also from Google',
        notes: 'A different buyer, Ali, finds us on search and fills a short form. Same inbox, same instant WhatsApp reply.',
      },
    ],
  },
  {
    id: 'qualify',
    number: 4,
    title: 'Qualify on WhatsApp',
    tab: 'Qualify',
    headline: 'The bot asks the questions, the agent gets a ready lead.',
    minutes: 3,
    takeaway: 'Agents only spend time on qualified leads.',
    cues: [
      {
        id: 'answers',
        label: 'Answer the questions',
        notes: 'Sana taps buttons instead of typing. The last answer is in Roman Urdu, and the bot still understands it.',
      },
      {
        id: 'profile',
        label: 'Fill the profile live',
        notes: 'Each answer lands in the profile on its own, and the score climbs to 82. Nobody typed anything.',
      },
      { id: 'brochure', label: 'Send the brochure', notes: 'Brochure and a short video go out automatically, and the timeline records both.' },
      {
        id: 'handover',
        label: 'Hand over to an agent',
        notes: 'Usman gets a ready lead with all the answers and a 10-minute countdown to call.',
      },
    ],
  },
  {
    id: 'calls',
    number: 5,
    title: 'WhatsApp calls',
    tab: 'Calls',
    headline: 'Calls on WhatsApp, logged automatically, never missed.',
    minutes: 3,
    takeaway: 'A missed call becomes a booked call back.',
    cues: [
      { id: 'dial', label: 'Agent calls the lead', notes: 'Usman taps Call in the app. Sana gets a normal WhatsApp call on her phone.' },
      { id: 'answer', label: 'Call answered', notes: 'Listen: Usman and Sana talk in Urdu (about 1 minute; voice plays at 1× and 2×). The call is live in the call log while it happens.' },
      {
        id: 'log',
        label: 'Call ends and is logged',
        notes: 'Outcome, summary and next step are saved to the lead. Sana gets the visit confirmation on WhatsApp.',
      },
      {
        id: 'missed',
        label: 'What if the call is missed?',
        notes: 'It is 9:40 pm and nobody can answer. The bot apologises within a second and books a call back.',
      },
    ],
  },
  {
    id: 'follow-up',
    number: 6,
    title: 'Follow-up until they buy',
    tab: 'Follow-up',
    headline: 'Nobody is forgotten.',
    minutes: 2.5,
    takeaway: 'Follow-ups and reminders run themselves.',
    cues: [
      { id: 'visit', label: 'Book the site visit', notes: 'Sana confirms with one tap and her card moves to Visit booked.' },
      {
        id: 'reminders',
        label: 'Reminders run on their own',
        notes: 'The clock jumps ahead: a reminder the evening before, and the location on the morning of the visit.',
      },
      {
        id: 'quiet',
        label: 'Lead goes quiet',
        notes: 'Bilal stopped replying. Day 1, 3 and 7 messages go out on their own; on day 7 he replies and is hot again.',
      },
      {
        id: 'manager',
        label: 'Manager sees the team',
        notes: 'Hira is alerted that 3 leads are waiting. One tap moves them to Maryam, and the board updates.',
      },
      { id: 'sold', label: 'Mark as sold', notes: 'Sana buys. Her card moves to Sale and she gets a welcome message.' },
    ],
  },
  {
    id: 'broadcast',
    number: 7,
    title: 'Broadcasts and smarter ads',
    tab: 'Broadcast',
    headline: 'Reuse every lead: broadcasts, retargeting and better ads.',
    minutes: 3,
    takeaway: 'Old leads become new sales, and the ads aim at real buyers.',
    cues: [
      { id: 'segment', label: 'Pick a segment', notes: 'Old leads are an asset. Three filters pick 1,284 warm leads who opted in to messages.' },
      {
        id: 'send',
        label: 'Send a WhatsApp broadcast',
        notes: 'One approved template goes to all of them. Watch delivered, read and replied fill up; Kamran, an old lead, replies.',
      },
      {
        id: 'feedback',
        label: 'Send sales back to the ads',
        notes: 'Each of the 11 sales is reported to the platform that brought it: 7 to Meta, 4 to Google.',
      },
      {
        id: 'learn',
        label: 'Ads learn',
        notes: 'Knowing who bought, the ads find similar people. Cost per qualified lead falls week by week.',
      },
    ],
  },
  {
    id: 'results',
    number: 8,
    title: 'The results',
    tab: 'Results',
    headline: 'What changes in one month.',
    minutes: 2,
    takeaway: 'Same ad budget, almost twice the sales.',
    cues: [
      { id: 'before-after', label: 'Before and after', notes: 'Read the five numbers slowly. Same budget; the difference is speed and follow-up.' },
      {
        id: 'campaigns',
        label: 'Which ad brings buyers',
        notes: 'Now every sale has a source, so the owner can see the best campaign and move budget to it.',
      },
      {
        id: 'summary',
        label: "Owner's morning summary",
        notes: 'Every morning at 9 the owner gets this on WhatsApp and can approve the suggestion with one tap.',
      },
    ],
  },
  {
    id: 'next',
    number: 9,
    title: "What's next",
    tab: "What's next",
    headline: 'From simulation to the real thing.',
    minutes: 1.5,
    takeaway: 'Approve the flow, and we start Phase 1.',
    cues: [
      { id: 'connect', label: 'What we connect', notes: 'These are the real systems the build connects. Nothing here is connected today; it is all simulated.' },
      { id: 'rollout', label: 'Rollout plan', notes: 'Four phases. Phase 1 alone already fixes slow replies. Durations are set after their review.' },
      {
        id: 'needs',
        label: 'What we need from you',
        notes: 'Hand them the phone on the right to try the app, then ask for approval and feedback.',
      },
    ],
  },
]

export const findScene = (id: string | undefined) => SCENES.find((s) => s.id === id)

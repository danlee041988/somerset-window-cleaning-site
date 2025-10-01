export type TeamMember = {
  slug: string
  name: string
  role: string
  bio: string
  image?: string
  specialties?: string[]
  funFact?: string
}

export const teamMembers: TeamMember[] = [
  {
    slug: 'dan',
    name: 'Dan',
    role: 'Owner & Lead Surveyor',
    image: '/images/team/dan-owner.jpg',
    bio: 'A former Royal Marine Commando, Dan swapped deployments for deionised water and founded SWC from the ground up. He still leads the technical surveys, sets the training standards, and makes sure every crew shows up with the kit and confidence to deliver.',
    specialties: ['Specialist surveys', 'Team development', 'Restoration projects'],
    funFact: 'Former Royal Marine who can strip and rebuild water-fed poles faster than most people make a cup of tea.',
  },
  {
    slug: 'sean',
    name: 'Sean',
    role: 'Operations Manager',
    bio: 'Based in Glastonbury with a young family, Sean is the calm voice behind most quotes and commercial schedules. He keeps the diary tight, designs access plans, and follows up after every visit so customers always know what's next.',
    image: '/images/team/sean-operations-manager.jpg',
    specialties: ['Quoting & proposals', 'Commercial planning', 'Client liaison'],
    funFact: 'Juggles school runs, site visits, and quote deadlines with the precision of a Swiss watchmaker.',
  },
  {
    slug: 'dylan',
    name: 'Dylan',
    role: 'Field Supervisor',
    bio: 'Originally from Scotland and dad to three lively kids, Dylan is our internal window cleaning specialist. He mentors new starters on safe access and delivers showroom finishes inside and out on every larger project.',
    image: '/images/team/dylan-supervisor.jpg',
    specialties: ['Internal detailing', 'Quality control', 'Team coaching'],
    funFact: 'Scottish dad of three who brought his obsessive attention to detail all the way from Glasgow to Somerset.',
  },
  {
    slug: 'woody',
    name: 'Woody',
    role: 'Senior Window Cleaner',
    image: '/images/team/woody-window-cleaner.jpg',
    bio: 'Woody leads our core window rounds and is the first face many customers recognise. His sweep through frames, seals, and finials leaves a signature sparkle—and he proactively flags maintenance issues before they escalate.',
    specialties: ['Pure-water rounds', 'Conservatory detailing', 'Preventative reporting'],
    funFact: 'Has an uncanny ability to spot loose guttering, dodgy seals, and potential issues before they become problems.',
  },
  {
    slug: 'josh',
    name: 'Josh',
    role: 'Window Cleaner',
    bio: 'Josh joined us from Bridgwater as the newest member of the crew. He specialises in gutter clearing with safe access rigs and camera inspections, while keeping residential customers updated at every step.',
    image: '/images/team/josh-window-cleaner.jpg',
    specialties: ['Gutter clearing', 'Access safety', 'Customer communication'],
    funFact: 'Newest crew member who treats every gutter like an archaeological dig—documenting everything with camera footage.',
  },
]

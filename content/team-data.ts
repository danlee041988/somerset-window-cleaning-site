export type TeamMember = {
  slug: string
  name: string
  role: string
  bio: string
  image?: string
  specialties?: string[]
}

export const teamMembers: TeamMember[] = [
  {
    slug: 'dan',
    name: 'Dan',
    role: 'Owner & Lead Surveyor',
    image: '/images/team/dan-owner.jpg',
    bio: 'A former Royal Marine Commando, Dan swapped deployments for deionised water and founded SWC from the ground up. He still leads the technical surveys, sets the training standards, and makes sure every crew shows up with the kit and confidence to deliver.',
    specialties: ['Specialist surveys', 'Team development', 'Restoration projects'],
  },
  {
    slug: 'sean',
    name: 'Sean',
    role: 'Operations Manager',
    bio: 'Based in Glastonbury with a young family, Sean is the calm voice behind most quotes and commercial schedules. He keeps the diary tight, designs access plans, and follows up after every visit so customers always know what’s next.',
    image: '/images/team/sean-operations-manager.jpg',
    specialties: ['Quoting & proposals', 'Commercial planning', 'Client liaison'],
  },
  {
    slug: 'dylan',
    name: 'Dylan',
    role: 'Field Supervisor',
    bio: 'Originally from Scotland and dad to three lively kids, Dylan is our internal window cleaning specialist. He mentors new starters on safe access and delivers showroom finishes inside and out on every larger project.',
    image: '/images/team/dylan-supervisor.jpg',
    specialties: ['Internal detailing', 'Quality control', 'Team coaching'],
  },
  {
    slug: 'woody',
    name: 'Woody',
    role: 'Senior Window Cleaner',
    bio: 'Woody leads our core window rounds and is the first face many customers recognise. His sweep through frames, seals, and finials leaves a signature sparkle—and he proactively flags maintenance issues before they escalate.',
    specialties: ['Pure-water rounds', 'Conservatory detailing', 'Preventative reporting'],
  },
  {
    slug: 'josh',
    name: 'Josh',
    role: 'Window Cleaner',
    bio: 'Josh joined us from Bridgwater as the newest member of the crew. He specialises in gutter clearing with safe access rigs and camera inspections, while keeping residential customers updated at every step.',
    image: '/images/team/josh-window-cleaner.jpg',
    specialties: ['Gutter clearing', 'Access safety', 'Customer communication'],
  },
]

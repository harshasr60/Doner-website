// Mock data for the application
// Replace this with real backend API calls

export interface Donor {
  id: string;
  name: string;
  email: string;
  mobile: string;
  amount: number;
  date: string;
  isPublic: boolean;
  programId: string;
  transactionId: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  utilizedAmount: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'upcoming';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

export interface PressRelease {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  source: string;
  link: string;
}

export interface ImpactReport {
  id: string;
  title: string;
  quarter: string;
  year: number;
  programsCount: number;
  beneficiaries: number;
  fundsUtilized: number;
  downloadUrl: string;
}

export const mockDonors: Donor[] = [
  {
    id: "DON001",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    mobile: "+919876543210",
    amount: 50000,
    date: "2026-02-10",
    isPublic: true,
    programId: "PROG001",
    transactionId: "TXN20260210001"
  },
  {
    id: "DON002",
    name: "Anonymous",
    email: "donor2@example.com",
    mobile: "+919876543211",
    amount: 25000,
    date: "2026-02-09",
    isPublic: false,
    programId: "PROG002",
    transactionId: "TXN20260209001"
  },
  {
    id: "DON003",
    name: "Priya Sharma",
    email: "priya@example.com",
    mobile: "+919876543212",
    amount: 100000,
    date: "2026-02-08",
    isPublic: true,
    programId: "PROG001",
    transactionId: "TXN20260208001"
  },
  {
    id: "DON004",
    name: "Amit Patel",
    email: "amit@example.com",
    mobile: "+919876543213",
    amount: 75000,
    date: "2026-02-07",
    isPublic: true,
    programId: "PROG003",
    transactionId: "TXN20260207001"
  },
  {
    id: "DON005",
    name: "Anonymous",
    email: "donor5@example.com",
    mobile: "+919876543214",
    amount: 30000,
    date: "2026-02-06",
    isPublic: false,
    programId: "PROG002",
    transactionId: "TXN20260206001"
  }
];

export const mockPrograms: Program[] = [
  {
    id: "PROG001",
    name: "Education for All",
    description: "Providing quality education to 500 underprivileged children",
    category: "Education",
    targetAmount: 5000000,
    raisedAmount: 3500000,
    utilizedAmount: 2800000,
    startDate: "2025-06-01",
    status: "active"
  },
  {
    id: "PROG002",
    name: "Healthcare Initiative",
    description: "Mobile medical camps in 50 villages",
    category: "Healthcare",
    targetAmount: 3000000,
    raisedAmount: 2100000,
    utilizedAmount: 1800000,
    startDate: "2025-08-01",
    status: "active"
  },
  {
    id: "PROG003",
    name: "Women Skill Development",
    description: "Vocational training for 200 women",
    category: "Women Empowerment",
    targetAmount: 2000000,
    raisedAmount: 1500000,
    utilizedAmount: 1200000,
    startDate: "2025-09-01",
    status: "active"
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "BLOG001",
    title: "Transforming Lives Through Education: Success Stories from Rural Maharashtra",
    excerpt: "Meet the students whose lives changed through our education programs",
    content: "Full article content here...",
    author: "Dr. Anjali Verma",
    date: "2026-02-01",
    category: "Education",
    image: "https://images.unsplash.com/photo-1763637675793-da207ba1fe18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMGNoYXJpdHl8ZW58MXx8fHwxNzcwOTE0NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "BLOG002",
    title: "The Power of Community: How We Built 10 Water Wells in 6 Months",
    excerpt: "A deep dive into our community development initiatives",
    content: "Full article content here...",
    author: "Vikram Singh",
    date: "2026-01-25",
    category: "Community Development",
    image: "https://images.unsplash.com/photo-1763816589196-45607083c4f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHJ1cmFsJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzcwOTEyNzYzfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "BLOG003",
    title: "Women Entrepreneurs: Breaking Barriers and Building Businesses",
    excerpt: "Inspiring stories from our women empowerment program",
    content: "Full article content here...",
    author: "Meera Nair",
    date: "2026-01-20",
    category: "Women Empowerment",
    image: "https://images.unsplash.com/photo-1623121608226-ca93dec4d94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGVtcG93ZXJtZW50JTIwd29ya3Nob3B8ZW58MXx8fHwxNzcwODM0NzUwfDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export const mockPressReleases: PressRelease[] = [
  {
    id: "PRESS001",
    title: "WOMBTO18 Receives National Award for Excellence in Social Work",
    excerpt: "Recognized for outstanding contribution to community development",
    date: "2026-01-15",
    source: "The Times of India",
    link: "#"
  },
  {
    id: "PRESS002",
    title: "New Partnership Announced with 15 Corporate Organizations",
    excerpt: "CSR collaboration to expand healthcare programs",
    date: "2026-01-10",
    source: "Economic Times",
    link: "#"
  },
  {
    id: "PRESS003",
    title: "WOMBTO18 Launches India's First Real-Time Donation Transparency Platform",
    excerpt: "Revolutionary technology allows donors to track every rupee",
    date: "2025-12-20",
    source: "Hindustan Times",
    link: "#"
  }
];

export const mockImpactReports: ImpactReport[] = [
  {
    id: "RPT001",
    title: "Q4 2025 Impact Report",
    quarter: "Q4",
    year: 2025,
    programsCount: 25,
    beneficiaries: 12500,
    fundsUtilized: 8500000,
    downloadUrl: "#"
  },
  {
    id: "RPT002",
    title: "Q3 2025 Impact Report",
    quarter: "Q3",
    year: 2025,
    programsCount: 23,
    beneficiaries: 11000,
    fundsUtilized: 7800000,
    downloadUrl: "#"
  },
  {
    id: "RPT003",
    title: "Q2 2025 Impact Report",
    quarter: "Q2",
    year: 2025,
    programsCount: 21,
    beneficiaries: 10200,
    fundsUtilized: 7200000,
    downloadUrl: "#"
  }
];

// Calculate total funds
export const getTotalFunds = () => {
  const totalReceived = mockDonors.reduce((sum, donor) => sum + donor.amount, 0);
  const totalUtilized = mockPrograms.reduce((sum, program) => sum + program.utilizedAmount, 0);
  return { totalReceived, totalUtilized };
};

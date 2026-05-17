import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  signal,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type CoverageCategory = Readonly<{
  title: string;
  description: string;
  icon: string;
  previewTitle: string;
  previewImage: string;
}>;

type ProductCard = Readonly<{
  title: string;
  body: string;
  image: string;
  size: 'wide' | 'portrait';
}>;

type MetricCard = Readonly<{
  value: string;
  label: string;
  body: string;
  image?: string;
  tone: 'photo' | 'orange' | 'blue' | 'gold';
}>;

type Partner = Readonly<{
  name: string;
  logo: string;
}>;

type Testimonial = Readonly<{
  title: string;
  body: string;
  tone: 'cream' | 'mint' | 'rose' | 'white';
}>;

type Faq = Readonly<{
  question: string;
  answer: string;
}>;

type SectionId = 'top' | 'cover' | 'services' | 'quote' | 'partners' | 'support';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, OnDestroy {
  protected readonly assetPath = 'theme/assets/images/';
  private productTimer: ReturnType<typeof setInterval> | null = null;
  private scrollAnimationContext: gsap.Context | null = null;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  protected readonly coverages: readonly CoverageCategory[] = [
    {
      title: 'Life Insurance',
      description: 'Financial support to beneficiaries after the insured person dies.',
      icon: '6897 1.svg',
      previewTitle: 'Life Insurance',
      previewImage: 'Screenshot 2026-04-27 at 21.35.44 1.svg',
    },
    {
      title: 'Education Insurance',
      description: "Plan ahead for a child's future education expenses.",
      icon: '6897 2.svg',
      previewTitle: 'Education Cover',
      previewImage: 'Screenshot 2026-04-27 at 21.35.44 1.svg',
    },
    {
      title: 'Health Insurance',
      description: 'Medical expenses such as hospital visits, treatments, and medicines.',
      icon: '6897 4.svg',
      previewTitle: 'Medical Insurance',
      previewImage: 'Screenshot 2026-04-27 at 21.39.26 1.svg',
    },
    {
      title: 'Renters Insurance',
      description: "Protect tenants' belongings in rented homes or apartments.",
      icon: '6897 5.svg',
      previewTitle: 'Renters Cover',
      previewImage: 'Screenshot 2026-04-27 at 21.35.44 1.svg',
    },
    {
      title: 'Home Insurance',
      description: 'Damage or loss to a house and belongings due to fire, theft, or disasters.',
      icon: '6897 6.svg',
      previewTitle: 'Home Insurance',
      previewImage: 'Screenshot 2026-04-27 at 21.35.44 1.svg',
    },
    {
      title: 'Marine Insurance',
      description: 'Ships, cargo, and goods transported by sea or waterways.',
      icon: '6897 7.svg',
      previewTitle: 'Marine Cover',
      previewImage: 'Screenshot 2026-04-27 at 21.39.26 1.svg',
    },
    {
      title: 'Pet Insurance',
      description: 'Veterinary treatment and medical care for pets.',
      icon: '6897 8.svg',
      previewTitle: 'Pet Insurance',
      previewImage: 'Screenshot 2026-04-27 at 21.35.44 1.svg',
    },
    {
      title: 'Travel Insurance',
      description: 'Trip cancellations, medical emergencies, and lost luggage.',
      icon: '6897 2.svg',
      previewTitle: 'Motor Insurance',
      previewImage: 'Screenshot 2026-04-27 at 21.40.50 1.svg',
    },
  ];

  protected readonly products: readonly ProductCard[] = [
    {
      title: 'Business',
      body: 'Get your SMEs, Mid-size & Corporate businesses insured today.',
      image: 'family.jpg',
      size: 'portrait',
    },
    {
      title: 'Life',
      body: 'Protection designed around your family, business, and long-term peace of mind.',
      image: 'Screenshot 2026-04-27 at 21.35.44 1.svg',
      size: 'portrait',
    },
    {
      title: 'Medical',
      body: 'Compare cover options clearly and make confident decisions in minutes.',
      image: 'Screenshot 2026-04-27 at 21.39.26 1.svg',
      size: 'portrait',
    },
    {
      title: 'Motor',
      body: 'Trusted cover for private cars, commercial fleets, and daily movement.',
      image: 'car-guy.png',
      size: 'portrait',
    },
    {
      title: 'Business',
      body: 'Get your SMEs, Mid-size & Corporate businesses insured today.',
      image: 'family.jpg',
      size: 'portrait',
    },
  ];

  protected readonly supportFeatures = [
    {
      title: '24x7 Support System',
      body: 'Available at any time of the day and any day of the week.',
      image: 'Sun.svg',
    },
    {
      title: 'Easy Claim System',
      body: 'Streamlined pay out processes within reasonable timelines.',
      image: 'Folder.svg',
    },
    {
      title: 'Digital FootPrint',
      body: 'All services made available online for ease of access.',
      image: 'moon.svg',
    },
  ] as const;

  protected readonly metrics: readonly MetricCard[] = [
    {
      value: '50+',
      label: 'Insurance Partners',
      body: 'Access quotes from a trusted network of providers.',
      image: 'african.jpg',
      tone: 'photo',
    },
    {
      value: '15K+',
      label: 'Policies Matched',
      body: 'Helping customers secure reliable coverage every single year.',
      tone: 'orange',
    },
    {
      value: '40%',
      label: 'Cost Savings',
      body: 'Compare rates side by side and discover better value in minutes.',
      tone: 'blue',
    },
    {
      value: '24/7',
      label: 'Expert Support',
      body: 'Dedicated agents ready to guide you through every step of your insurance journey.',
      image: 'Rectangle 17.svg',
      tone: 'gold',
    },
    {
      value: '98%',
      label: 'Customer Satisfaction',
      body: 'Fast, transparent, and stress-free insurance comparisons customers trust.',
      image: 'customer.jpg',
      tone: 'photo',
    },
  ];

  protected readonly partners: readonly Partner[] = [
    { name: 'Sanlam', logo: 'image 1.svg' },
    { name: 'GA Insurance', logo: 'Ga.svg' },
    { name: 'Fidelity Insurance', logo: 'fidelity.svg' },
    { name: 'Takaful Insurance', logo: 'Vector (2).svg' },
    { name: 'Jubilee', logo: 'image 5.svg' },
    {name:'APA',logo:'apa.png'}
  ];

  protected readonly testimonials: readonly Testimonial[] = [
    {
      title: 'I Love Having Affordable Coverage!',
      body: 'Comparing insurance quotes was quick and stress-free. I found a policy that fits my budget perfectly.',
      tone: 'rose',
    },
    {
      title: 'Reliable Support Whenever I Need It',
      body: 'The customer service team was incredibly responsive and helpful throughout the whole process.',
      tone: 'cream',
    },
    {
      title: 'The Best Insurance Experience So Far',
      body: 'The platform made everything simple to understand and helped me choose the right coverage.',
      tone: 'mint',
    },
    {
      title: 'Fast Quotes & Amazing Savings!',
      body: 'I compared multiple providers in minutes and ended up with better coverage at a lower price.',
      tone: 'white',
    },
  ];

  protected readonly faqs: readonly Faq[] = [
    {
      question: 'Who am I buying my policy from?',
      answer: 'You buy directly from the licensed insurer shown in your selected quote. ISEC helps you compare, understand, and complete the process.',
    },
    {
      question: 'Can I compare several insurance covers?',
      answer: 'Yes. The experience is designed to compare different providers and coverage types side by side before you commit.',
    },
    {
      question: 'Does ISEC help after I buy?',
      answer: 'Yes. Support agents can guide you through policy questions, renewals, documents, and claim steps.',
    },
    {
      question: 'How fast can I get a quote?',
      answer: 'Most simple covers can be matched in minutes once the required details are available.',
    },
    {
      question: 'Are the quotes binding?',
      answer: 'Quotes depend on eligibility, provider review, and final policy terms. The final policy document is the binding reference.',
    },
    {
      question: 'Can businesses use ISEC?',
      answer: 'Yes. The platform can support individual customers, families, SMEs, and larger organizations.',
    },
  ];

  protected readonly activeProductIndex = signal(1);
  protected readonly isCoverageMenuOpen = signal(false);
  protected readonly showFloatingNav = signal(false);
  protected readonly activeCoverageIndex = signal(7);
  protected readonly openFaqIndex = signal<number | null>(0);

  protected readonly activeProduct = computed(() => this.products[this.activeProductIndex()]);
  protected readonly activeCoverage = computed(() => this.coverages[this.activeCoverageIndex()]);
  private readonly handlePopState = (): void => this.scrollToCurrentPath('smooth');
  protected readonly scrollProgress = signal(0);

  protected imageUrl(fileName: string): string {
    return `${this.assetPath}${fileName}`;
  }

  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.syncFloatingNav();
    window.setTimeout(() => this.setupScrollAnimations(), 0);
    window.addEventListener('popstate', this.handlePopState);
    window.setTimeout(() => this.scrollToCurrentPath('auto'));
    this.productTimer = setInterval(() => this.nextProduct(), 20000);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('popstate', this.handlePopState);
    }

    this.scrollAnimationContext?.revert();
    this.scrollAnimationContext = null;

    if (this.productTimer) {
      clearInterval(this.productTimer);
    }
  }

  @HostListener('window:scroll')
  protected syncFloatingNav(): void {
    if (!isPlatformBrowser(this.platformId)) {return}

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    this.scrollProgress.set(progress);
    this.showFloatingNav.set(scrollTop > window.innerHeight * 0.72);
  }

  protected selectProduct(index: number): void {
    this.activeProductIndex.set(index);
    this.restartProductTimer();
  }

  protected toggleCoverageMenu(): void {
    this.isCoverageMenuOpen.update((isOpen) => !isOpen);
    window.setTimeout(() => ScrollTrigger.refresh(), 0);
  }

  protected selectCoverage(index: number): void {
    this.activeCoverageIndex.set(index);
  }

  protected navigateToSection(sectionId: SectionId, event: Event): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    event.preventDefault();
    this.isCoverageMenuOpen.set(false);
    window.history.pushState(null, '', this.pathForSection(sectionId));
    this.scrollToSection(sectionId, 'smooth');
  }

  protected nextProduct(): void {
    this.activeProductIndex.update((index) => (index + 1) % this.products.length);
  }

  protected previousProduct(): void {
    this.activeProductIndex.update((index) => (index + this.products.length - 1) % this.products.length);
    this.restartProductTimer();
  }

  protected toggleFaq(index: number): void {
    this.openFaqIndex.update((current) => (current === index ? null : index));
    window.setTimeout(() => ScrollTrigger.refresh(), 0);
  }

  private setupScrollAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.scrollAnimationContext?.revert();

    this.scrollAnimationContext = gsap.context(() => {
      gsap.to('.landing-hero', {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.fromTo('.product-card', {
        y: 0,
        opacity: 0.82,
        scale: 1,
        filter: 'blur(0px) brightness(1) saturate(0.92)',
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px) brightness(1) saturate(1)',
        stagger: 0.14,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.product-stage',
          start: 'top 94%',
          end: 'top 34%',
          scrub: 1.15,
        },
      });

      gsap.fromTo('.product-title, .product-copy', {
        y: 36,
        opacity: 0.36,
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.product-stage',
          start: 'top 88%',
          end: 'top 36%',
          scrub: 1,
        },
      });

      gsap.to('.product-card img', {
        yPercent: -9,
        scale: 1.065,
        ease: 'none',
        scrollTrigger: {
          trigger: '.product-stage',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.from('.service-grid article', {
        x: -72,
        opacity: 0,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.service-band',
          start: 'top 82%',
          end: 'top 24%',
          scrub: 1.5,
        },
      });

      gsap.from('.growth-section h1', {
        scale: 0.72,
        y: 80,
        opacity: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.growth-section',
          start: 'top 82%',
          end: 'top 14%',
          scrub: 2,
        },
      });

      gsap.from('.growth-section .shape-left', {
        xPercent: -18,
        yPercent: 12,
        rotation: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.growth-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.from('.growth-section .shape-right', {
        xPercent: 16,
        yPercent: -10,
        rotation: 16,
        ease: 'none',
        scrollTrigger: {
          trigger: '.growth-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.fromTo('.metric-card', {
        y: 72,
        opacity: 0.62,
        scale: 0.93,
        filter: 'blur(12px) brightness(1) saturate(0.92)',
      }, {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px) brightness(1) saturate(1)',
        stagger: 0.12,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.metric-grid',
          start: 'top 92%',
          end: 'top 34%',
          scrub: 1.15,
        },
      });

      gsap.fromTo('.metric-card > div', {
        x: -34,
        opacity: 0.42,
      }, {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.metric-grid',
          start: 'top 88%',
          end: 'top 32%',
          scrub: 1,
        },
      });

      gsap.to('.metric-card img', {
        yPercent: -8,
        scale: 1.055,
        ease: 'none',
        scrollTrigger: {
          trigger: '.metric-grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.from('.partner-section h2, .partner-marquee', {
        y: 52,
        opacity: 0,
        stagger: 0.14,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.partner-section',
          start: 'top 78%',
          end: 'top 32%',
          scrub: 1.2,
        },
      });

      gsap.from('.proof-copy', {
        x: -70,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.proof-section',
          start: 'top 78%',
          end: 'top 20%',
          scrub: 1.5,
        },
      });

      gsap.from('.testimonial-card:nth-child(odd)', {
        x: -70,
        y: 40,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.proof-section',
          start: 'top 75%',
          end: 'top 12%',
          scrub: 1.5,
        },
      });

      gsap.from('.testimonial-card:nth-child(even)', {
        x: 70,
        y: -30,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.proof-section',
          start: 'top 75%',
          end: 'top 12%',
          scrub: 1.5,
        },
      });

      gsap.from('.faq-item', {
        x: 50,
        opacity: 0,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq-section',
          start: 'top 80%',
          end: 'top 25%',
          scrub: 1.2,
        },
      });
    });

    ScrollTrigger.refresh();
  }

  private restartProductTimer(): void {
    if (!isPlatformBrowser(this.platformId) || !this.productTimer) {
      return;
    }

    clearInterval(this.productTimer);
    this.productTimer = setInterval(() => this.nextProduct(), 20000);
  }

  private scrollToCurrentPath(behavior: ScrollBehavior): void {
    this.scrollToSection(this.sectionFromPath(window.location.pathname), behavior);
  }

  private scrollToSection(sectionId: SectionId, behavior: ScrollBehavior): void {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior, block: 'start' });
  }

  private sectionFromPath(pathname: string): SectionId {
    const cleanPath = pathname.replace(/^\/|\/$/g, '');

    if (cleanPath === 'cover' || cleanPath === 'services' || cleanPath === 'quote' || cleanPath === 'partners' || cleanPath === 'support') {
      return cleanPath;
    }

    return 'top';
  }

  private pathForSection(sectionId: SectionId): string {
    return sectionId === 'top' ? '/' : `/${sectionId}`;
  }
}

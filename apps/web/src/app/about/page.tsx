import { Button } from '@/components/ui/button'
import { Heart, Leaf, Shield, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: 'Natural & Pure',
      description:
        'We source only the finest natural ingredients, ensuring purity and potency in every product.',
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description:
        'All our products undergo rigorous testing to meet the highest standards of quality and safety.',
    },
    {
      icon: Heart,
      title: 'Health Focused',
      description:
        'Your wellbeing is our priority. We create products that truly make a difference in your health.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description:
        'We believe in building a community of health-conscious individuals supporting each other.',
    },
  ]

  const team = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Chief Ayurvedic Consultant',
      image: 'https://via.placeholder.com/200x200?text=Dr.+Priya',
      description:
        'With over 15 years of experience in Ayurveda, Dr. Sharma leads our product development.',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Quality Control Manager',
      image: 'https://via.placeholder.com/200x200?text=Rajesh',
      description:
        'Ensures every product meets our stringent quality standards before reaching you.',
    },
    {
      name: 'Meera Patel',
      role: 'Customer Care Head',
      image: 'https://via.placeholder.com/200x200?text=Meera',
      description: 'Dedicated to providing exceptional customer service and support.',
    },
  ]

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-8 border-b border-[#EEEEEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#333333]">About Us</h1>
          <p className="text-[#666666] mt-2">Home / About</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#333333] mb-6">
                Your Journey to <span className="text-[#8BC34A]">Natural Wellness</span>
              </h2>
              <p className="text-lg text-[#666666] mb-6">
                At Riyansh, we believe in the ancient wisdom of Ayurveda combined with modern
                quality standards. Our mission is to bring you the purest, most effective natural
                health products that have been trusted for centuries.
              </p>
              <p className="text-[#666666] mb-8">
                Founded in 2020, we have been dedicated to sourcing the finest herbs and ingredients
                from trusted suppliers across India. Every product is carefully crafted to maintain
                its natural potency while meeting contemporary safety and quality standards.
              </p>
              <Link href="/store">
                <Button size="lg">Explore Our Products</Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#A5D6A7] to-[#8BC34A] rounded-2xl p-8">
                <Image
                  src="https://via.placeholder.com/500x500?text=Ayurvedic+Products"
                  alt="Ayurvedic Products"
                  width={500}
                  height={500}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-[#A5D6A7]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Our Core Values</h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              These principles guide everything we do, from product selection to customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 text-center shadow-sm border border-[#EEEEEE]"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BC34A] rounded-full mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#333333] mb-3">{value.title}</h3>
                  <p className="text-[#666666]">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#8BC34A] mb-2">10,000+</div>
              <div className="text-[#666666]">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#8BC34A] mb-2">500+</div>
              <div className="text-[#666666]">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#8BC34A] mb-2">5+</div>
              <div className="text-[#666666]">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#8BC34A] mb-2">99%</div>
              <div className="text-[#666666]">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-[#A5D6A7]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Meet Our Team</h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Our dedicated team of experts is committed to bringing you the best in natural health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center shadow-sm border border-[#EEEEEE]"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#333333] mb-1">{member.name}</h3>
                <p className="text-[#8BC34A] font-medium mb-3">{member.role}</p>
                <p className="text-[#666666] text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#8BC34A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of satisfied customers who have transformed their health with our natural
            products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store">
              <Button variant="secondary" size="lg">
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#8BC34A]"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

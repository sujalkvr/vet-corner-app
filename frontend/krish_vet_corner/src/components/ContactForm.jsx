import { Instagram, Youtube, Linkedin, Mail } from 'lucide-react';

const Contact = () => {
  const contactLinks = [
    { 
      icon: Instagram, 
      href: 'https://instagram.com/krishvetcorner', 
      label: 'Instagram',
      gradient: 'from-pink-500 to-purple-500'
    },
    { 
      icon: Youtube, 
      href: 'https://youtube.com/@krishvetcorner', 
      label: 'YouTube',
      gradient: 'from-red-500 to-red-600'
    },
    { 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/company/krish-vet-corner/', 
      label: 'LinkedIn',
      gradient: 'from-blue-500 to-blue-700'
    },
    { 
      icon: Mail, 
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=vetcorner2025@gmail.com', 
      label: 'Email',
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Let's Connect!
        </h2>
        
        <p className="text-lg md:text-xl text-green-600 mb-12 max-w-2xl mx-auto">
          Reach out anytime. Your pet's health is our priority
        </p>

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-6 flex-wrap">
          {contactLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110"
                aria-label={link.label}
              >
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-gray-700 group-hover:text-white relative z-10 transition-all duration-300" />
                <div className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-300`} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;
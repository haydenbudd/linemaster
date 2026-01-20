import { Shield, Award, Users, Flag } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    { icon: Shield, text: 'ISO Certified', color: 'from-blue-500 to-indigo-500' },
    { icon: Award, text: '70+ Years Experience', color: 'from-purple-500 to-pink-500' },
    { icon: Users, text: 'Trusted by 10,000+ Companies', color: 'from-teal-500 to-cyan-500' },
    { icon: Flag, text: 'Made in USA', color: 'from-red-500 to-blue-500' },
  ];

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-accent/50 to-transparent hover:from-accent hover:shadow-lg transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}>
              <badge.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-center font-semibold text-foreground leading-tight">
              {badge.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
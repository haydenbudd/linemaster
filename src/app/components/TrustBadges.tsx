import { Shield, Award, Users, Flag } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    { icon: Shield, text: 'ISO Certified' },
    { icon: Award, text: '70+ Years Experience' },
    { icon: Users, text: '10,000+ Companies' },
    { icon: Flag, text: 'Made in USA' },
  ];

  return (
    <div className="mt-10 pt-6 border-t border-foreground/5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] transition-all duration-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
              <badge.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-medium text-foreground leading-tight">
              {badge.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

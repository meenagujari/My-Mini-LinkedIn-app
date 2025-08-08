import { Card, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
  postsCount: number;
}

export function ProfileStats({ postsCount }: ProfileStatsProps) {
  const stats = [
    { 
      label: "Posts", 
      value: postsCount, 
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      textColor: "text-blue-700"
    },
    { 
      label: "Connections", 
      value: Math.floor(Math.random() * 500) + 50, 
      color: "from-green-500 to-green-600",
      bg: "bg-green-50", 
      textColor: "text-green-700"
    },
    { 
      label: "Profile Views", 
      value: Math.floor(Math.random() * 1000) + 100, 
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.label} className="shadow-soft border-0 hover-lift animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-6 text-center">
            <div className={`w-16 h-16 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg shadow-medium`}></div>
            </div>
            <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value.toLocaleString()}</div>
            <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
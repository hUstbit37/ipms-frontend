import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Palette, Lightbulb, FileText, TrendingUp, Clock } from "lucide-react";
import { Header } from "@/components/header";

export default function Home() {
  const stats = [
    {
      title: "Tổng nhãn hiệu",
      value: "1,234",
      change: "+12 trong tháng này",
      icon: Tag,
    },
    {
      title: "Kiểu dáng công nghiệp",
      value: "567",
      change: "+8 trong tháng này",
      icon: Palette,
    },
    {
      title: "Sáng chế",
      value: "89",
      change: "+3 trong tháng này",
      icon: Lightbulb,
    },
    {
      title: "Tổng hồ sơ",
      value: "1,890",
      change: "+23 trong tuần này",
      icon: FileText,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Nhãn hiệu ABC đã được cấp bằng",
      description: "Số đơn: 4-2023-12345",
      time: "2 giờ trước",
      type: "trademark",
      icon: Tag,
    },
    {
      id: 2,
      title: "Kiểu dáng XYZ đang chờ thẩm định",
      description: "Số đơn: 4-2023-54321",
      time: "5 giờ trước",
      type: "design",
      icon: Palette,
    },
    {
      id: 3,
      title: "Sáng chế DEF đã nộp đơn",
      description: "Số đơn: 1-2023-98765",
      time: "1 ngày trước",
      type: "patent",
      icon: Lightbulb,
    },
    {
      id: 4,
      title: "Nhãn hiệu GHI sắp hết hạn",
      description: "Ngày hết hạn: 15/12/2025",
      time: "2 ngày trước",
      type: "warning",
      icon: Clock,
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      name: "Nhãn hiệu ABC",
      type: "Gia hạn",
      deadline: "15/12/2025",
      status: "urgent",
    },
    {
      id: 2,
      name: "Kiểu dáng XYZ",
      type: "Phản hồi văn bản",
      deadline: "20/12/2025",
      status: "warning",
    },
    {
      id: 3,
      name: "Sáng chế DEF",
      type: "Nộp bổ sung",
      deadline: "25/12/2025",
      status: "normal",
    },
  ];

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Tổng quan về quản lý sở hữu trí tuệ
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Thống kê theo tháng</CardTitle>
              <CardDescription>
                Số lượng hồ sơ được nộp trong 6 tháng gần đây
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Biểu đồ thống kê sẽ được hiển thị tại đây</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Công việc sắp đến hạn</CardTitle>
              <CardDescription>
                Các hồ sơ cần xử lý trong thời gian tới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 border-l-2 border-primary/20 pl-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${
                        item.status === 'urgent' ? 'text-destructive' :
                        item.status === 'warning' ? 'text-orange-500' :
                        'text-muted-foreground'
                      }`}>
                        {item.deadline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Cập nhật mới nhất về các hồ sơ SHTT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

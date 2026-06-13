"use client";
import type { PortfolioData, GitHubStats } from "@/lib/types";
import { ModeProvider, useMode } from "@/components/ModeProvider";
import { TopBar } from "@/components/steam/TopBar";
import { ProfileHeader } from "@/components/steam/ProfileHeader";
import { Sidebar } from "@/components/steam/Sidebar";
import { FeaturedStack } from "@/components/steam/FeaturedStack";
import { BigStats } from "@/components/steam/BigStats";
import { AboutMe } from "@/components/steam/AboutMe";
import { FeaturedProject } from "@/components/steam/FeaturedProject";
import { RecentActivity } from "@/components/steam/RecentActivity";
import { Testimonials } from "@/components/steam/Testimonials";
import { Footer } from "@/components/steam/Footer";
import { Starfield } from "@/components/steam/Starfield";
import { RecruiterToggle } from "@/components/recruiter/RecruiterToggle";
import { ResumeView } from "@/components/recruiter/ResumeView";

function Inner({ data }: { data: PortfolioData }) {
  const { recruiter } = useMode();

  if (recruiter) {
    return (
      <div className="shell">
        <div className="content" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 0" }}>
            <RecruiterToggle />
          </div>
          <main id="profile">
            <ResumeView data={data} />
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-stage">
        <div className="bg-fallback" />
        <Starfield />
        <div className="bg-vignette" />
      </div>
      <div className="shell">
        <TopBar data={data} />
        <div className="content" style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
          <RecruiterToggle />
        </div>
        <ProfileHeader data={data} />
        <main id="profile">
          <div className="content">
            <div className="profile-body">
              <div className="col-main">
                <FeaturedStack data={data} />
                <BigStats data={data} />
                <AboutMe data={data} />
                <FeaturedProject data={data} />
                <RecentActivity data={data} />
                <Testimonials data={data} />
              </div>
              <div className="col-side"><Sidebar data={data} /></div>
            </div>
          </div>
        </main>
        <Footer data={data} />
      </div>
    </>
  );
}

export function Shell({ data, github }: { data: PortfolioData; github: GitHubStats | null }) {
  void github; // merged into `data` upstream in page.tsx; reserved for future use
  return (
    <ModeProvider>
      <Inner data={data} />
    </ModeProvider>
  );
}

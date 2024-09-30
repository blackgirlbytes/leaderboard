import HacktoberfestLeaderboard from '../components/HacktoberfestLeaderboard'

export default function Home({ initialLeaderboardData }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HacktoberfestLeaderboard initialData={initialLeaderboardData} />
    </main>
  )
}

export async function getStaticProps() {
  const REPOS = [
    'galaxy-bytes/main-test-repo',
    'GCodeHouse/Cohort4',
    'TBD54566975/developer.tbd.website'
    //'blackgirlbytes/LunaFocus'
    // Add more repos as needed
  ];

  const POINT_VALUES = {
    small: 5,
    medium: 10,
    large: 15
  };

 const GITHUB_TOKEN = process.env.GITHUB_TOKEN

  const calculatePoints = (labels) => {
    const size = labels.find(label => POINT_VALUES[label.name.toLowerCase()]);
    return size ? POINT_VALUES[size.name.toLowerCase()] : POINT_VALUES.small; // Default to small (5 points)
  };

  const fetchRepoPRs = async (repo) => {
    try {
      console.log(`Fetching PRs for ${repo}`);
      const response = await fetch(`https://api.github.com/repos/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=100`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });
  
      console.log(`Response status for ${repo}: ${response.status}`);
      
      if (response.status === 404) {
        console.warn(`Repository not found or not accessible: ${repo}`);
        return [];
      }
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const prs = await response.json();
      console.log(`Fetched ${prs.length} PRs for ${repo}`);
  
      const hacktoberfestStart = new Date();
      hacktoberfestStart.setFullYear(hacktoberfestStart.getFullYear() - 3);
  
      const filteredPRs = prs.filter(pr => 
        pr.merged_at && 
        new Date(pr.merged_at) > hacktoberfestStart
      );
      console.log(`Filtered to ${filteredPRs.length} PRs for ${repo}`);
  
      const hacktoberfestPRs = await Promise.all(filteredPRs.map(async pr => {
        try {
          const prDetailsResponse = await fetch(pr.url, {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
            },
          });
  
          if (!prDetailsResponse.ok) throw new Error(`HTTP error! status: ${prDetailsResponse.status}`);
          
          const prDetails = await prDetailsResponse.json();
          const isHacktoberfest = prDetails.labels.some(label => label.name.toLowerCase() === 'hacktoberfest');
          
          console.log(`PR #${pr.number} in ${repo} is${isHacktoberfest ? '' : ' not'} a Hacktoberfest PR`);
  
          return isHacktoberfest ? {
            user: pr.user.login,
            points: calculatePoints(prDetails.labels),
            repo: repo,
            prNumber: pr.number,
            prTitle: pr.title,
          } : null;
        } catch (error) {
          console.warn(`Error fetching PR details for ${pr.url}: ${error.message}`);
          return null;
        }
      }));
  
      const validHacktoberfestPRs = hacktoberfestPRs.filter(Boolean);
      console.log(`Found ${validHacktoberfestPRs.length} valid Hacktoberfest PRs for ${repo}`);
  
      return validHacktoberfestPRs;
    } catch (error) {
      console.error(`Error fetching PRs for ${repo}:`, error);
      return [];
    }
  };

  try {
    const allPRs = await Promise.all(REPOS.map(fetchRepoPRs));
    const flatPRs = allPRs.flat();

    const leaderboard = flatPRs.reduce((acc, pr) => {
      if (!acc[pr.user]) acc[pr.user] = { points: 0, prs: 0 };
      acc[pr.user].points += pr.points;
      acc[pr.user].prs += 1;
      return acc;
    }, {});

    const sortedLeaderboard = Object.entries(leaderboard)
      .sort(([, a], [, b]) => b.points - a.points)
      .map(([username, data], index) => ({ 
        rank: index + 1, 
        username, 
        points: data.points, 
        prs: data.prs 
      }));

    return { 
      props: { initialLeaderboardData: sortedLeaderboard }
    };
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return { 
      props: { initialLeaderboardData: [] }
    };
  }
}
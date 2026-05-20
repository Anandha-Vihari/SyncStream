export interface DSAVideo {
  title: string;
  url: string;
}

export interface DSAStep {
  title: string;
  videos: DSAVideo[];
}

export const dsaCourseData: DSAStep[] = [
  {
    title: "Step 1: Learn the basics",
    videos: [
      { title: "Lec 1: Things to Know in C++/Java/Python", url: "https://www.youtube.com/watch?v=EAR7De6Gof4" },
      { title: "Lec 2: If Else, Switch, Loops", url: "https://www.youtube.com/watch?v=0Z69uBvE9yM" },
      { title: "Lec 3: Patterns 1", url: "https://www.youtube.com/watch?v=tHm0u9_SkoI" },
      { title: "Lec 4: Time and Space Complexity", url: "https://www.youtube.com/watch?v=FPuAptUvT_o" }
    ]
  },
  {
    title: "Step 2: Sorting Techniques",
    videos: [
      { title: "Lec 1: Selection Sort", url: "https://www.youtube.com/watch?v=HGk_ypEuS24" },
      { title: "Lec 2: Bubble Sort", url: "https://www.youtube.com/watch?v=zOhUavxlzw4" },
      { title: "Lec 3: Insertion Sort", url: "https://www.youtube.com/watch?v=nKzEJWbkK08" },
      { title: "Lec 4: Merge Sort", url: "https://www.youtube.com/watch?v=ogjf7ORKfd8" },
      { title: "Lec 5: Quick Sort", url: "https://www.youtube.com/watch?v=WIrA4YexLRQ" }
    ]
  },
  {
    title: "Step 3: Arrays",
    videos: [
      { title: "Lec 1: Largest Element in Array", url: "https://www.youtube.com/watch?v=37E9ckMDdTk" },
      { title: "Lec 2: Second Largest Element", url: "https://www.youtube.com/watch?v=37E9ckMDdTk" },
      { title: "Lec 3: Check if Array is Sorted", url: "https://www.youtube.com/watch?v=37E9ckMDdTk" },
      { title: "Lec 4: Remove Duplicates", url: "https://www.youtube.com/watch?v=FmIghPRBuY4" }
    ]
  },
  {
    title: "Step 6: LinkedList",
    videos: [
      { title: "Lec 1: Introduction to LL", url: "https://www.youtube.com/watch?v=Nq7ok-OyEpg" },
      { title: "Lec 2: Inserting/Deleting in LL", url: "https://www.youtube.com/watch?v=Nq7ok-OyEpg" },
      { title: "Lec 3: Doubly Linked List", url: "https://www.youtube.com/watch?v=0eVMm7s0hK4" }
    ]
  },
  {
    title: "Step 13: Binary Trees",
    videos: [
      { title: "Lec 1: Intro to Trees", url: "https://www.youtube.com/watch?v=_ANr03I00as" },
      { title: "Lec 2: Binary Tree Traversals", url: "https://www.youtube.com/watch?v=jmy0lGnxLYw" },
      { title: "Lec 3: Maximum Depth of Binary Tree", url: "https://www.youtube.com/watch?v=eD3tmO666yQ" }
    ]
  },
  {
    title: "Step 15: Graphs",
    videos: [
      { title: "Lec 1: Introduction to Graphs", url: "https://www.youtube.com/watch?v=M3_pLsDdeuU" },
      { title: "Lec 2: Graph Representation", url: "https://www.youtube.com/watch?v=OsNICEw0S9s" },
      { title: "Lec 3: BFS in Graph", url: "https://www.youtube.com/watch?v=-tgVp8_G_3c" },
      { title: "Lec 4: DFS in Graph", url: "https://www.youtube.com/watch?v=Qzf1a--rhp8" }
    ]
  },
  {
    title: "Step 16: Dynamic Programming",
    videos: [
      { title: "Lec 1: Introduction to DP", url: "https://www.youtube.com/watch?v=tyB0ztf0DNY" },
      { title: "Lec 2: Climbing Stairs", url: "https://www.youtube.com/watch?v=tyB0ztf0DNY" },
      { title: "Lec 3: Frog Jump", url: "https://www.youtube.com/watch?v=EgGNTZNoZMs" }
    ]
  }
];

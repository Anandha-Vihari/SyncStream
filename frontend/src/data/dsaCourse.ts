export interface DSATopic {
  title: string;
  url: string;
}

export interface DSASubStep {
  title: string;
  topics: DSATopic[];
}

export interface DSAStep {
  title: string;
  subSteps: DSASubStep[];
}

export const dsaCourseData: DSAStep[] = [
  {
    title: "Step 1: Learn the basics",
    subSteps: [
      {
        title: "Things to Know",
        topics: [
          { title: "User Input / Output", url: "https://youtu.be/EAR7De6Gof4?t=250" },
          { title: "Data Types", url: "https://youtu.be/EAR7De6Gof4?t=755" },
          { title: "If Else statements", url: "https://youtu.be/EAR7De6Gof4?t=1259" },
          { title: "Switch Statement", url: "https://youtu.be/EAR7De6Gof4" },
          { title: "What are arrays, strings?", url: "https://youtu.be/EAR7De6Gof4?t=2415" },
          { title: "For loops", url: "https://youtu.be/EAR7De6Gof4?t=3096" },
          { title: "While loops", url: "https://youtu.be/EAR7De6Gof4?t=3459" },
          { title: "Functions", url: "https://youtu.be/EAR7De6Gof4?t=3677" },
          { title: "Time Complexity", url: "https://youtu.be/FPuAptUvT_o" }
        ]
      },
      {
        title: "Build-up Logical Thinking",
        topics: [
          { title: "Patterns", url: "https://www.youtube.com/watch?v=tNm_NNSB3_w" }
        ]
      },
      {
        title: "Learn STL/Java-Collections",
        topics: [
          { title: "C++ STL", url: "https://www.youtube.com/watch?v=RRVYpIET_RU" }
        ]
      },
      {
        title: "Know Basic Maths",
        topics: [
          { title: "Count Digits", url: "https://youtu.be/1xNbjMdbjug" },
          { title: "Reverse a Number", url: "https://youtu.be/1xNbjMdbjug?t=930" },
          { title: "Check Palindrome", url: "https://youtu.be/1xNbjMdbjug?t=1230" },
          { title: "GCD Or HCF", url: "https://youtu.be/1xNbjMdbjug?t=2684" },
          { title: "Armstrong Numbers", url: "https://youtu.be/1xNbjMdbjug?t=1418" },
          { title: "Print all Divisors", url: "https://youtu.be/1xNbjMdbjug?t=1580" },
          { title: "Check for Prime", url: "https://youtu.be/1xNbjMdbjug?t=2381" }
        ]
      },
      {
        title: "Learn Basic Recursion",
        topics: [
          { title: "Introduction", url: "https://www.youtube.com/watch?v=yVdKa8dnKiE" },
          { title: "Print name N times", url: "https://www.youtube.com/watch?v=un6PLygfXrA" },
          { title: "Sum of first N numbers", url: "https://www.youtube.com/watch?v=69ZCDFy-OUo" },
          { title: "Reverse an array", url: "https://www.youtube.com/watch?v=twuC1F6gLI8" },
          { title: "Fibonacci Number", url: "https://www.youtube.com/watch?v=kvRjNm4rVBE" }
        ]
      }
    ]
  },
  {
    title: "Step 2: Learn Sorting",
    subSteps: [
      {
        title: "Sorting-I",
        topics: [
          { title: "Selection Sort", url: "https://youtu.be/HGk_ypEuS24?t=167" },
          { title: "Bubble Sort", url: "https://youtu.be/HGk_ypEuS24?t=1061" },
          { title: "Insertion Sort", url: "https://youtu.be/HGk_ypEuS24?t=1900" }
        ]
      },
      {
        title: "Sorting-II",
        topics: [
          { title: "Merge Sort", url: "https://youtu.be/ogjf7ORKfd8" },
          { title: "Quick Sort", url: "https://youtu.be/WIrA4YexLRQ" }
        ]
      }
    ]
  },
  {
    title: "Step 3: Arrays",
    subSteps: [
      {
        title: "Easy",
        topics: [
          { title: "Largest Element", url: "https://youtu.be/37E9ckMDdTk?t=526" },
          { title: "Second Largest", url: "https://youtu.be/37E9ckMDdTk?t=810" },
          { title: "Check if sorted", url: "https://youtu.be/37E9ckMDdTk?t=17224" },
          { title: "Remove duplicates", url: "https://youtu.be/37E9ckMDdTk?t=1887" },
          { title: "Left Rotate", url: "https://youtu.be/wvcQg43_V8U?t=485" },
          { title: "Move Zeros", url: "https://youtu.be/wvcQg43_V8U?t=1633" },
          { title: "Missing number", url: "https://youtu.be/bYWLJb3vCWY?t=57" },
          { title: "Max Consecutive Ones", url: "https://youtu.be/bYWLJb3vCWY?t=1124" }
        ]
      },
      {
        title: "Medium",
        topics: [
          { title: "2Sum Problem", url: "https://youtu.be/UXDSeD9mN-k" },
          { title: "Sort 0s, 1s and 2s", url: "https://youtu.be/tp8JIuCXBaU" },
          { title: "Majority Element", url: "https://youtu.be/nP_ns3uSh80" },
          { title: "Kadane's Algorithm", url: "https://youtu.be/AHZpyENo7k4" },
          { title: "Stock Buy and Sell", url: "https://youtu.be/excAOvwF_Wk" }
        ]
      }
    ]
  },
  {
    title: "Step 4: Binary Search",
    subSteps: [
      {
        title: "BS on 1D Arrays",
        topics: [
          { title: "Binary Search", url: "https://youtu.be/MHf6awe89xw" },
          { title: "Lower/Upper Bound", url: "https://youtu.be/6zhGS79oQ4k" },
          { title: "Rotated Sorted Array", url: "https://youtu.be/5qGrJbHhqFs" }
        ]
      }
    ]
  },
  {
    title: "Step 15: Graphs",
    subSteps: [
      {
        title: "Learning",
        topics: [
          { title: "BFS", url: "https://youtu.be/-tgVpUgsQ5k" },
          { title: "DFS", url: "https://youtu.be/Qzf1a--rhp8" }
        ]
      },
      {
        title: "Shortest Path",
        topics: [
          { title: "Dijkstra's Algorithm", url: "https://www.youtube.com/watch?v=rp1SMw7HSO8" },
          { title: "Bellman Ford", url: "https://youtu.be/0vVofAhAYjc" }
        ]
      }
    ]
  },
  {
    title: "Step 16: Dynamic Programming",
    subSteps: [
      {
        title: "Introduction",
        topics: [
          { title: "DP Introduction", url: "https://youtu.be/tyB0ztf0DNY" }
        ]
      },
      {
        title: "1D DP",
        topics: [
          { title: "Climbing Stairs", url: "https://youtu.be/mLfjzJsN8us" },
          { title: "Frog Jump", url: "https://www.youtube.com/watch?v=EgG3jsGoPvQ" }
        ]
      }
    ]
  }
];

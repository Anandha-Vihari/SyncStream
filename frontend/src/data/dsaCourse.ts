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
        title: "Lec 1: Things to Know",
        topics: [
          { title: "User Input / Output", url: "https://youtu.be/EAR7De6Gof4?t=250" },
          { title: "Data Types", url: "https://youtu.be/EAR7De6Gof4?t=755" },
          { title: "If Else statements", url: "https://youtu.be/EAR7De6Gof4?t=1259" },
          { title: "Functions", url: "https://youtu.be/EAR7De6Gof4?t=3677" }
        ]
      },
      {
        title: "Lec 2: Build-up Logical Thinking",
        topics: [{ title: "Pattern Solving", url: "https://www.youtube.com/watch?v=tNm_NNSB3_w" }]
      },
      {
        title: "Lec 3: Learn STL",
        topics: [{ title: "C++ STL / Java Collections", url: "https://www.youtube.com/watch?v=RRVYpIET_RU" }]
      },
      {
        title: "Lec 4: Know Basic Maths",
        topics: [{ title: "Maths for DSA", url: "https://youtu.be/1xNbjMdbjug" }]
      },
      {
        title: "Lec 5: Learn Basic Recursion",
        topics: [{ title: "Recursion Basics", url: "https://www.youtube.com/watch?v=yVdKa8dnKiE" }]
      },
      {
        title: "Lec 6: Learn Basic Hashing",
        topics: [{ title: "Hashing Theory & Practice", url: "https://www.youtube.com/watch?v=KEs5UyBJ39g" }]
      }
    ]
  },
  {
    title: "Step 2: Learn Sorting",
    subSteps: [
      {
        title: "Lec 1: Sorting-I",
        topics: [
          { title: "Selection Sort", url: "https://youtu.be/HGk_ypEuS24?t=167" },
          { title: "Bubble Sort", url: "https://youtu.be/HGk_ypEuS24?t=1061" },
          { title: "Insertion Sort", url: "https://youtu.be/HGk_ypEuS24?t=1900" }
        ]
      },
      {
        title: "Lec 2: Sorting-II",
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
        title: "Lec 1: Easy",
        topics: [
          { title: "Largest Element", url: "https://youtu.be/37E9ckMDdTk" },
          { title: "Left Rotate", url: "https://youtu.be/wvcQg43_V8U" },
          { title: "Move Zeros", url: "https://youtu.be/wvcQg43_V8U" }
        ]
      },
      {
        title: "Lec 2: Medium",
        topics: [
          { title: "2Sum Problem", url: "https://youtu.be/UXDSeD9mN-k" },
          { title: "Kadane's Algorithm", url: "https://youtu.be/AHZpyENo7k4" },
          { title: "Next Permutation", url: "https://youtu.be/JDOXKqF60RQ" }
        ]
      },
      {
        title: "Lec 3: Hard",
        topics: [
          { title: "Pascal's Triangle", url: "https://youtu.be/bR7mQgwQ_o8" },
          { title: "3-Sum Problem", url: "https://youtu.be/DhFh8Kw7ymk" }
        ]
      }
    ]
  },
  {
    title: "Step 4: Binary Search",
    subSteps: [
      {
        title: "Lec 1: BS on 1D Arrays",
        topics: [{ title: "BS Introduction", url: "https://youtu.be/MHf6awe89xw" }]
      },
      {
        title: "Lec 2: BS on Answers",
        topics: [{ title: "Aggressive Cows", url: "https://youtu.be/R_Mfw4ew-Vo" }]
      }
    ]
  },
  {
    title: "Step 5: Strings",
    subSteps: [
      {
        title: "Lec 1: Basic and Easy",
        topics: [{ title: "Reverse/Anagram/Palindrome", url: "https://www.youtube.com/watch?v=0_u6_n2Y8oA" }]
      }
    ]
  },
  {
    title: "Step 6: Learn LinkedList",
    subSteps: [
      {
        title: "Lec 1: Learn 1D LinkedList",
        topics: [{ title: "Intro and Insertion/Deletion", url: "https://youtu.be/Nq7ok-OyEpg" }]
      },
      {
        title: "Lec 2: Learn Doubly LinkedList",
        topics: [{ title: "DLL Operations", url: "https://youtu.be/VaECK03Dz-g" }]
      }
    ]
  },
  {
    title: "Step 7: Recursion",
    subSteps: [
      {
        title: "Lec 1: Strong Hold",
        topics: [{ title: "Recursion Patterns", url: "https://www.youtube.com/watch?v=yVdKa8dnKiE" }]
      }
    ]
  },
  {
    title: "Step 8: Bit Manipulation",
    subSteps: [
      {
        title: "Lec 1: Learning",
        topics: [{ title: "Bitwise Operators", url: "https://www.youtube.com/watch?v=5rtVTYAk9KQ" }]
      }
    ]
  },
  {
    title: "Step 9: Stack and Queues",
    subSteps: [
      {
        title: "Lec 1: Learning",
        topics: [{ title: "Implementations", url: "https://www.youtube.com/watch?v=iTf4rU_ZdfE" }]
      }
    ]
  },
  {
    title: "Step 10: Sliding Window & Two Pointer",
    subSteps: [
      {
        title: "Lec 1: Combined Problems",
        topics: [{ title: "Sliding Window Patterns", url: "https://www.youtube.com/watch?v=9hc8H8C3Nqw" }]
      }
    ]
  },
  {
    title: "Step 11: Heaps",
    subSteps: [
      {
        title: "Lec 1: Learning",
        topics: [{ title: "Heapify & Priority Queue", url: "https://www.youtube.com/watch?v=HqPJF2L5h9U" }]
      }
    ]
  },
  {
    title: "Step 12: Greedy Algorithms",
    subSteps: [
      {
        title: "Lec 1: Easy/Medium/Hard",
        topics: [{ title: "Greedy Patterns", url: "https://www.youtube.com/watch?v=HzeK7g8cD0Y" }]
      }
    ]
  },
  {
    title: "Step 13: Binary Trees",
    subSteps: [
      {
        title: "Lec 1: Traversals",
        topics: [{ title: "Pre/In/Post/Level Order", url: "https://youtu.be/RlUu72JrOCQ" }]
      },
      {
        title: "Lec 2: Medium Problems",
        topics: [{ title: "Height/Diameter/Balanced", url: "https://youtu.be/eD3tmO666yQ" }]
      }
    ]
  },
  {
    title: "Step 14: Binary Search Trees",
    subSteps: [
      {
        title: "Lec 1: Concepts",
        topics: [{ title: "BST Search/Insert/Delete", url: "https://www.youtube.com/watch?v=p7-9UvDQZ3w" }]
      }
    ]
  },
  {
    title: "Step 15: Graphs",
    subSteps: [
      {
        title: "Lec 1: Learning",
        topics: [{ title: "BFS and DFS", url: "https://youtu.be/-tgVpUgsQ5k" }]
      },
      {
        title: "Lec 2: BFS/DFS Problems",
        topics: [{ title: "Cycle Detection / Islands", url: "https://www.youtube.com/watch?v=ZWh30777Sog" }]
      }
    ]
  },
  {
    title: "Step 16: Dynamic Programming",
    subSteps: [
      {
        title: "Lec 1: Introduction",
        topics: [{ title: "Memoization vs Tabulation", url: "https://youtu.be/tyB0ztf0DNY" }]
      },
      {
        title: "Lec 2: 1D DP",
        topics: [{ title: "Climbing Stairs / Frog Jump", url: "https://youtu.be/mLfjzJsN8us" }]
      }
    ]
  },
  {
    title: "Step 17: Tries",
    subSteps: [
      {
        title: "Lec 1: Theory and Implementation",
        topics: [{ title: "Insert/Search/StartsWith", url: "https://www.youtube.com/watch?v=dBGUmUQhjaM" }]
      }
    ]
  },
  {
    title: "Step 18: Advanced Strings",
    subSteps: [
      {
        title: "Lec 1: Algorithms",
        topics: [{ title: "KMP / Z-Algorithm", url: "https://www.youtube.com/watch?v=qQ8vS2btsxI" }]
      }
    ]
  }
];

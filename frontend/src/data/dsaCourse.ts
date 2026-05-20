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
        topics: [{ title: "Pattern 1 to 22", url: "https://www.youtube.com/watch?v=tNm_NNSB3_w" }]
      },
      {
        title: "Lec 3: Learn STL / Java Collections",
        topics: [{ title: "C++ STL / Java Collections", url: "https://www.youtube.com/watch?v=RRVYpIET_RU" }]
      },
      {
        title: "Lec 4: Know Basic Maths",
        topics: [{ title: "Maths for DSA", url: "https://youtu.be/1xNbjMdbjug" }]
      },
      {
        title: "Lec 5: Learn Basic Recursion",
        topics: [{ title: "Recursion Introduction", url: "https://www.youtube.com/watch?v=yVdKa8dnKiE" }]
      },
      {
        title: "Lec 6: Learn Basic Hashing",
        topics: [{ title: "Hashing Theory", url: "https://www.youtube.com/watch?v=KEs5UyBJ39g" }]
      }
    ]
  },
  {
    title: "Step 2: Learn Sorting",
    subSteps: [
      {
        title: "Lec 1: Sorting-I",
        topics: [{ title: "Selection/Bubble/Insertion Sort", url: "https://youtu.be/HGk_ypEuS24" }]
      },
      {
        title: "Lec 2: Sorting-II",
        topics: [{ title: "Merge/Quick Sort", url: "https://youtu.be/ogjf7ORKfd8" }]
      }
    ]
  },
  {
    title: "Step 3: Arrays",
    subSteps: [
      {
        title: "Lec 1: Easy",
        topics: [{ title: "Largest/Rotate/Zeros", url: "https://youtu.be/37E9ckMDdTk" }]
      },
      {
        title: "Lec 2: Medium",
        topics: [{ title: "2Sum/Kadane/Stock", url: "https://youtu.be/UXDSeD9mN-k" }]
      },
      {
        title: "Lec 3: Hard",
        topics: [{ title: "Pascal/3Sum/4Sum", url: "https://youtu.be/bR7mQgwQ_o8" }]
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
        topics: [{ title: "Square Root/Koko/Packages", url: "https://youtu.be/qyfekrNni90" }]
      },
      {
        title: "Lec 3: BS on 2D Arrays",
        topics: [{ title: "Search in Matrix", url: "https://youtu.be/JXU4Akft7yk" }]
      }
    ]
  },
  {
    title: "Step 5: Strings",
    subSteps: [
      {
        title: "Lec 1: Basic and Easy",
        topics: [{ title: "Reverse/Anagram/Palindrome", url: "https://www.youtube.com/watch?v=0_u6_n2Y8oA" }]
      },
      {
        title: "Lec 2: Medium String Problems",
        topics: [{ title: "Longest Palindromic Substring", url: "https://www.youtube.com/watch?v=D86atX_T6B0" }]
      }
    ]
  },
  {
    title: "Step 6: Learn LinkedList",
    subSteps: [
      {
        title: "Lec 1: Learn 1D LinkedList",
        topics: [{ title: "Intro and Operations", url: "https://youtu.be/Nq7ok-OyEpg" }]
      },
      {
        title: "Lec 2: Learn Doubly LinkedList",
        topics: [{ title: "DLL Operations", url: "https://youtu.be/VaECK03Dz-g" }]
      },
      {
        title: "Lec 3: Medium Problems of LL",
        topics: [{ title: "Middle/Reverse/Cycle", url: "https://youtu.be/7LjQ57RqgEc" }]
      },
      {
        title: "Lec 4: Medium Problems of DLL",
        topics: [{ title: "Delete Occurrences/Pairs", url: "https://www.youtube.com/watch?v=MlowXSIHWy8" }]
      },
      {
        title: "Lec 5: Hard Problems of LL",
        topics: [{ title: "Reverse in K-groups/Flattening", url: "https://youtu.be/uTwH2E67K_U" }]
      }
    ]
  },
  {
    title: "Step 7: Recursion",
    subSteps: [
      {
        title: "Lec 1: Strong Hold",
        topics: [{ title: "Functional/Parameterized", url: "https://www.youtube.com/watch?v=yVdKa8dnKiE" }]
      },
      {
        title: "Lec 2: Subsequences Pattern",
        topics: [{ title: "Print Subsequences", url: "https://www.youtube.com/watch?v=Ax0Xv5U5Z60" }]
      },
      {
        title: "Lec 3: Hard Recursion",
        topics: [{ title: "N-Queens/Sudoku", url: "https://www.youtube.com/watch?v=i05Ju7AFTcM" }]
      }
    ]
  },
  {
    title: "Step 8: Bit Manipulation",
    subSteps: [
      {
        title: "Lec 1: Learning",
        topics: [{ title: "Bitwise Operators", url: "https://www.youtube.com/watch?v=5rtVTYAk9KQ" }]
      },
      {
        title: "Lec 2: Interview Problems",
        topics: [{ title: "Power Set/Single Number", url: "https://www.youtube.com/watch?v=bT_m867D3vE" }]
      },
      {
        title: "Lec 3: Advanced Maths",
        topics: [{ title: "Sieve/Prime Factors", url: "https://www.youtube.com/watch?v=nP_nP_jV0O8" }]
      }
    ]
  },
  {
    title: "Step 9: Stack and Queues",
    subSteps: [
      {
        title: "Lec 1: Learning",
        topics: [{ title: "Array/LL Implementation", url: "https://www.youtube.com/watch?v=iTf4rU_ZdfE" }]
      },
      {
        title: "Lec 2: Conversions",
        topics: [{ title: "Infix/Postfix/Prefix", url: "https://www.youtube.com/watch?v=vvZ35fM-Moc" }]
      },
      {
        title: "Lec 3: Monotonic Stack/Queue",
        topics: [{ title: "Next Greater/Smaller", url: "https://www.youtube.com/watch?v=7_A_XlHhFwA" }]
      },
      {
        title: "Lec 4: Implementation Problems",
        topics: [{ title: "LRU/LFU Cache", url: "https://www.youtube.com/watch?v=xV3Z0__n-8k" }]
      }
    ]
  },
  {
    title: "Step 10: Sliding Window & Two Pointer",
    subSteps: [
      {
        title: "Lec 1: Medium Problems",
        topics: [{ title: "Sliding Window Basics", url: "https://www.youtube.com/watch?v=9hc8H8C3Nqw" }]
      },
      {
        title: "Lec 2: Hard Problems",
        topics: [{ title: "Minimum Window Substring", url: "https://www.youtube.com/watch?v=WXP8uHn8FfU" }]
      }
    ]
  },
  {
    title: "Step 11: Heaps",
    subSteps: [
      {
        title: "Lec 1: Learning",
        topics: [{ title: "Heapify/PQ", url: "https://www.youtube.com/watch?v=HqPJF2L5h9U" }]
      },
      {
        title: "Lec 2: Medium Problems",
        topics: [{ title: "Kth Largest", url: "https://www.youtube.com/watch?v=yAs3tONaf3s" }]
      },
      {
        title: "Lec 3: Hard Problems",
        topics: [{ title: "Median in a Stream", url: "https://www.youtube.com/watch?v=1K3_A8p__B8" }]
      }
    ]
  },
  {
    title: "Step 12: Greedy Algorithms",
    subSteps: [
      {
        title: "Lec 1: Easy Problems",
        topics: [{ title: "Cookies/Lemonade", url: "https://www.youtube.com/watch?v=HzeK7g8cD0Y" }]
      },
      {
        title: "Lec 2: Medium/Hard",
        topics: [{ title: "N Meetings/Job Sequencing", url: "https://www.youtube.com/watch?v=t_fXoYQZ-aE" }]
      }
    ]
  },
  {
    title: "Step 13: Binary Trees",
    subSteps: [
      {
        title: "Lec 1: Traversals",
        topics: [{ title: "In/Pre/Post/Level", url: "https://youtu.be/RlUu72JrOCQ" }]
      },
      {
        title: "Lec 2: Medium Problems",
        topics: [{ title: "Height/Diameter/Views", url: "https://youtu.be/eD3tmO666yQ" }]
      },
      {
        title: "Lec 3: Hard Problems",
        topics: [{ title: "LCA/Path Sum/Serialize", url: "https://www.youtube.com/watch?v=nHMQ2v_XvAY" }]
      }
    ]
  },
  {
    title: "Step 14: Binary Search Trees",
    subSteps: [
      {
        title: "Lec 1: Concepts",
        topics: [{ title: "BST Search/Insert/Delete", url: "https://www.youtube.com/watch?v=p7-9UvDQZ3w" }]
      },
      {
        title: "Lec 2: Practice Problems",
        topics: [{ title: "Ceil/Floor/Validate", url: "https://www.youtube.com/watch?v=KSsk8AhdOza" }]
      }
    ]
  },
  {
    title: "Step 15: Graphs",
    subSteps: [
      {
        title: "Lec 1: Learning",
        topics: [{ title: "BFS/DFS Introduction", url: "https://youtu.be/-tgVpUgsQ5k" }]
      },
      {
        title: "Lec 2: BFS/DFS Problems",
        topics: [{ title: "Islands/Oranges/Cycle", url: "https://www.youtube.com/watch?v=ZWh30777Sog" }]
      },
      {
        title: "Lec 3: Topo Sort",
        topics: [{ title: "Kahn's/Course Schedule", url: "https://www.youtube.com/watch?v=73sneFXuTEg" }]
      },
      {
        title: "Lec 4: Shortest Path",
        topics: [{ title: "Dijkstra/Bellman/Floyd", url: "https://www.youtube.com/watch?v=rp1SMw7HSO8" }]
      },
      {
        title: "Lec 5: MST / Disjoint Set",
        topics: [{ title: "Prim/Kruskal/Union-Find", url: "https://www.youtube.com/watch?v=rnYBi9N_n_4" }]
      },
      {
        title: "Lec 6: Other Algorithms",
        topics: [{ title: "Bridges/Articulation Points", url: "https://www.youtube.com/watch?v=2r5K5TzZ_Y4" }]
      }
    ]
  },
  {
    title: "Step 16: Dynamic Programming",
    subSteps: [
      {
        title: "Lec 1: Introduction",
        topics: [{ title: "Memoization/Tabulation", url: "https://youtu.be/tyB0ztf0DNY" }]
      },
      {
        title: "Lec 2: 1D DP",
        topics: [{ title: "Climbing Stairs/Frog Jump", url: "https://youtu.be/mLfjzJsN8us" }]
      },
      {
        title: "Lec 3: 2D/3D DP",
        topics: [{ title: "Unique Paths/Minimum Sum", url: "https://www.youtube.com/watch?v=TmhpgXScLyY" }]
      },
      {
        title: "Lec 4: DP on Subsequences",
        topics: [{ title: "Subset Sum/Knapsack", url: "https://www.youtube.com/watch?v=fWCvaZifS5Q" }]
      },
      {
        title: "Lec 5: DP on Strings",
        topics: [{ title: "LCS/Edit Distance", url: "https://www.youtube.com/watch?v=NPZn9jBrX8U" }]
      },
      {
        title: "Lec 6: DP on Stocks",
        topics: [{ title: "Buy/Sell I-VI", url: "https://www.youtube.com/watch?v=nGJmxHujT_0" }]
      },
      {
        title: "Lec 7: DP on LIS",
        topics: [{ title: "Longest Increasing Subsequence", url: "https://www.youtube.com/watch?v=ekCwMsllX8u" }]
      },
      {
        title: "Lec 8: MCM DP",
        topics: [{ title: "Matrix Chain Multiplication", url: "https://www.youtube.com/watch?v=vRVfmbCFW2E" }]
      },
      {
        title: "Lec 9: DP on Squares",
        topics: [{ title: "Maximal Square", url: "https://www.youtube.com/watch?v=auS1fynPnjo" }]
      }
    ]
  },
  {
    title: "Step 17: Tries",
    subSteps: [
      {
        title: "Lec 1: Theory and Implementation",
        topics: [{ title: "Insert/Search/Prefix", url: "https://www.youtube.com/watch?v=dBGUmUQhjaM" }]
      },
      {
        title: "Lec 2: Problems",
        topics: [{ title: "Longest Word/Max XOR", url: "https://www.youtube.com/watch?v=5tkA_I4_2Vw" }]
      }
    ]
  },
  {
    title: "Step 18: Advanced Strings",
    subSteps: [
      {
        title: "Lec 1: Pattern Matching",
        topics: [{ title: "KMP Algorithm", url: "https://www.youtube.com/watch?v=qQ8vS2btsxI" }]
      },
      {
        title: "Lec 2: Z-Algorithm",
        topics: [{ title: "Pattern Search O(N+M)", url: "https://www.youtube.com/watch?v=CpZh4eF8QBw" }]
      },
      {
        title: "Lec 3: Manacher's",
        topics: [{ title: "Longest Palindromic O(N)", url: "https://www.youtube.com/watch?v=V-sEwsca1ak" }]
      }
    ]
  }
];

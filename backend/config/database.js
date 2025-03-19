const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

async function createUsersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

async function createProblemsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS problem (
      problem_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      difficulty VARCHAR(50) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
      topics TEXT[] NOT NULL,
      input_format TEXT NOT NULL,
      output_format TEXT NOT NULL,
      example_cases JSONB NOT NULL,
      cpp_template TEXT NOT NULL,
      java_template TEXT NOT NULL
    );
  `;
  await pool.query(query);
  console.log("✅ Problem table created (if not exists).");
}
async function insertProblems() {
  const query = `
    INSERT INTO problem (title, description, difficulty, topics, input_format, output_format, example_cases, cpp_template, java_template) 
VALUES 
  ('Two Sum', 
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'Easy', 
  ARRAY['Array', 'Hash Table'], 
  'First line: an integer n (size of array)\nSecond line: n space-separated integers\nThird line: an integer target', 
  'Two space-separated integers representing the indices of the two numbers.', 
  '[{"input": "4\\n2 7 11 15\\n9", "output": "0 1"}]',
  '#include <iostream>\n#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n  // Your code here\n}\n\nint main() {\n  int n, target;\n  cin >> n;\n  vector<int> nums(n);\n  for (int i = 0; i < n; i++) cin >> nums[i];\n  cin >> target;\n  vector<int> result = twoSum(nums, target);\n  cout << result[0] << " " << result[1] << endl;\n  return 0;\n}',
  'import java.util.*;\nclass Main {\n  public static int[] twoSum(int[] nums, int target) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    int target = sc.nextInt();\n    int[] result = twoSum(nums, target);\n    System.out.println(result[0] + " " + result[1]);\n    sc.close();\n  }\n}'
  ),
  ('Subarray Sum Equals K', 
  'Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k.',
  'Medium', 
  ARRAY['Array', 'Hash Table', 'Prefix Sum'], 
  'First line: an integer n (size of array)\nSecond line: n space-separated integers\nThird line: an integer k', 
  'A single integer representing the count of subarrays with sum equal to k.', 
  '[{"input": "5\\n1 1 1 2 3\\n3", "output": "3"}]',
  '#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint subarraySum(vector<int>& nums, int k) {\n  // Your code here\n}\n\nint main() {\n  int n, k;\n  cin >> n;\n  vector<int> nums(n);\n  for (int i = 0; i < n; i++) cin >> nums[i];\n  cin >> k;\n  cout << subarraySum(nums, k) << endl;\n  return 0;\n}',
  'import java.util.*;\nclass Main {\n  public static int subarraySum(int[] nums, int k) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    int k = sc.nextInt();\n    System.out.println(subarraySum(nums, k));\n    sc.close();\n  }\n}'
  ),
  (
  'Product of Array Except Self', 
  'Given an array nums of n integers, return an array output such that output[i] is equal to the product of all elements of nums except nums[i]. Solve it without using division.',
  'Medium', 
  ARRAY['Array', 'Prefix Product'], 
  'First line: an integer n (size of array)\nSecond line: n space-separated integers', 
  'A single line containing n space-separated integers representing the output array.', 
  '[{"input": "4\\n1 2 3 4", "output": "24 12 8 6"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nvector<int> productExceptSelf(vector<int>& nums) {\n  // Your code here\n}\n\nint main() {\n  int n;\n  cin >> n;\n  vector<int> nums(n);\n  for (int i = 0; i < n; i++) cin >> nums[i];\n  vector<int> result = productExceptSelf(nums);\n  for (int num : result) cout << num << " ";\n  cout << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int[] productExceptSelf(int[] nums) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    int[] result = productExceptSelf(nums);\n    for (int num : result) System.out.print(num + " ");\n    System.out.println();\n    sc.close();\n  }\n}'
),
(
  'Longest Substring Without Repeating Characters', 
  'Given a string s, find the length of the longest substring without repeating characters.',
  'Medium', 
  ARRAY['String', 'Sliding Window', 'Hash Table'], 
  'A single line containing the string s.', 
  'A single integer representing the length of the longest substring without repeating characters.', 
  '[{"input": "abcabcbb", "output": "3"}]', 
  '#include <iostream>\n#include <string>\nusing namespace std;\nint lengthOfLongestSubstring(string s) {\n  // Your code here\n}\n\nint main() {\n  string s;\n  cin >> s;\n  cout << lengthOfLongestSubstring(s) << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int lengthOfLongestSubstring(String s) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.next();\n    System.out.println(lengthOfLongestSubstring(s));\n    sc.close();\n  }\n}'
),
(
  'Maximum Sum Subarray of Size K', 
  'Given an array of integers nums and an integer k, find the maximum sum of any contiguous subarray of length k.',
  'Easy', 
  ARRAY['Array', 'Sliding Window'], 
  'First line: an integer n (size of array)\nSecond line: n space-separated integers\nThird line: an integer k', 
  'A single integer representing the maximum sum of any contiguous subarray of size k.', 
  '[{"input": "5\\n2 1 5 1 3\\n3", "output": "9"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nint maxSumSubarray(vector<int>& nums, int k) {\n  // Your code here\n}\n\nint main() {\n  int n, k;\n  cin >> n;\n  vector<int> nums(n);\n  for (int i = 0; i < n; i++) cin >> nums[i];\n  cin >> k;\n  cout << maxSumSubarray(nums, k) << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int maxSumSubarray(int[] nums, int k) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    int k = sc.nextInt();\n    System.out.println(maxSumSubarray(nums, k));\n    sc.close();\n  }\n}'
),
(
  'Search in Rotated Sorted Array', 
  'Given a rotated sorted array nums and an integer target, return the index of target if it is in nums, otherwise return -1. You must write an algorithm with O(log n) runtime complexity.',
  'Medium', 
  ARRAY['Array', 'Binary Search'], 
  'First line: an integer n (size of array)\nSecond line: n space-separated integers (rotated sorted array)\nThird line: an integer target', 
  'A single integer representing the index of the target element or -1 if not found.', 
  '[{"input": "7\\n4 5 6 7 0 1 2\\n0", "output": "4"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nint search(vector<int>& nums, int target) {\n  // Your code here\n}\n\nint main() {\n  int n, target;\n  cin >> n;\n  vector<int> nums(n);\n  for (int i = 0; i < n; i++) cin >> nums[i];\n  cin >> target;\n  cout << search(nums, target) << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int search(int[] nums, int target) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    int target = sc.nextInt();\n    System.out.println(search(nums, target));\n    sc.close();\n  }\n}'
),
(
  'Median of Two Sorted Arrays', 
  'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
  'Hard', 
  ARRAY['Array', 'Binary Search', 'Divide and Conquer'], 
  'First line: an integer m (size of first array)\nSecond line: m space-separated integers (first sorted array)\nThird line: an integer n (size of second array)\nFourth line: n space-separated integers (second sorted array)', 
  'A single floating-point number representing the median.', 
  '[{"input": "2\\n1 3\\n2\\n2", "output": "2.0"}]', 
  '#include <iostream>\n#include <vector>\n#include <iomanip>\nusing namespace std;\ndouble findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n  // Your code here\n}\n\nint main() {\n  int m, n;\n  cin >> m;\n  vector<int> nums1(m);\n  for (int i = 0; i < m; i++) cin >> nums1[i];\n  cin >> n;\n  vector<int> nums2(n);\n  for (int i = 0; i < n; i++) cin >> nums2[i];\n  cout << fixed << setprecision(1) << findMedianSortedArrays(nums1, nums2) << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int m = sc.nextInt();\n    int[] nums1 = new int[m];\n    for (int i = 0; i < m; i++) nums1[i] = sc.nextInt();\n    int n = sc.nextInt();\n    int[] nums2 = new int[n];\n    for (int i = 0; i < n; i++) nums2[i] = sc.nextInt();\n    System.out.println(findMedianSortedArrays(nums1, nums2));\n    sc.close();\n  }\n}'
),
(
  'Reverse a Linked List', 
  'Given the head of a singly linked list, reverse the list and return the new head.',
  'Easy', 
  ARRAY['Linked List'], 
  'First line: an integer n (size of linked list)\nSecond line: n space-separated integers representing the linked list nodes.', 
  'A single line containing n space-separated integers representing the reversed linked list.', 
  '[{"input": "5\\n1 2 3 4 5", "output": "5 4 3 2 1"}]', 
  '#include <iostream>\nusing namespace std;\nstruct ListNode {\n  int val;\n  ListNode* next;\n  ListNode(int x) : val(x), next(nullptr) {}\n};\nListNode* reverseList(ListNode* head) {\n  // Your code here\n}\nint main() {\n  int n, val;\n  cin >> n;\n  ListNode* head = nullptr, *tail = nullptr;\n  for (int i = 0; i < n; i++) {\n    cin >> val;\n    ListNode* node = new ListNode(val);\n    if (!head) head = tail = node;\n    else tail->next = node, tail = node;\n  }\n  head = reverseList(head);\n  while (head) cout << head->val << " ", head = head->next;\n  cout << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass ListNode {\n  int val;\n  ListNode next;\n  ListNode(int x) { val = x; next = null; }\n}\nclass Main {\n  public static ListNode reverseList(ListNode head) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    ListNode head = null, tail = null;\n    for (int i = 0; i < n; i++) {\n      int val = sc.nextInt();\n      ListNode node = new ListNode(val);\n      if (head == null) head = tail = node;\n      else tail.next = node; tail = node;\n    }\n    head = reverseList(head);\n    while (head != null) {\n      System.out.print(head.val + \" \");\n      head = head.next;\n    }\n    System.out.println();\n    sc.close();\n  }\n}'
),
(
  'Detect Cycle in a Linked List', 
  'Given the head of a singly linked list, determine if it has a cycle using Floyd’s cycle detection algorithm.',
  'Medium', 
  ARRAY['Linked List', 'Two Pointers'], 
  'First line: an integer n (size of linked list)\nSecond line: n space-separated integers representing the linked list nodes\nThird line: an integer pos (position where the last node is connected, -1 if no cycle).', 
  'A single string: "Cycle detected" if a cycle exists, otherwise "No cycle".', 
  '[{"input": "3\\n3 2 0\\n1", "output": "Cycle detected"}]', 
  '#include <iostream>\nusing namespace std;\nstruct ListNode {\n  int val;\n  ListNode* next;\n  ListNode(int x) : val(x), next(nullptr) {}\n};\nbool hasCycle(ListNode* head) {\n  // Your code here\n}\nint main() {\n  int n, val, pos;\n  cin >> n;\n  ListNode* head = nullptr, *tail = nullptr;\n  vector<ListNode*> nodes;\n  for (int i = 0; i < n; i++) {\n    cin >> val;\n    ListNode* node = new ListNode(val);\n    nodes.push_back(node);\n    if (!head) head = tail = node;\n    else tail->next = node, tail = node;\n  }\n  cin >> pos;\n  if (pos != -1) tail->next = nodes[pos];\n  cout << (hasCycle(head) ? \"Cycle detected\" : \"No cycle\") << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass ListNode {\n  int val;\n  ListNode next;\n  ListNode(int x) { val = x; next = null; }\n}\nclass Main {\n  public static boolean hasCycle(ListNode head) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    ListNode head = null, tail = null;\n    ListNode[] nodes = new ListNode[n];\n    for (int i = 0; i < n; i++) {\n      int val = sc.nextInt();\n      nodes[i] = new ListNode(val);\n      if (head == null) head = tail = nodes[i];\n      else tail.next = nodes[i]; tail = nodes[i];\n    }\n    int pos = sc.nextInt();\n    if (pos != -1) tail.next = nodes[pos];\n    System.out.println(hasCycle(head) ? \"Cycle detected\" : \"No cycle\");\n    sc.close();\n  }\n}'
),
(
  'Valid Parentheses', 
  'Given a string containing just the characters ''('', '')'', ''{'', ''}'', ''['', and '']'', determine if the input string is valid. A string is valid if open brackets are closed by the same type of brackets and in the correct order.',
  'Easy', 
  ARRAY['Stack', 'String'], 
  'A single line containing a string s consisting of ''('', '')'', ''{'', ''}'', ''['', and '']''.', 
  'A single string: "Valid" if the parentheses are balanced, otherwise "Invalid".', 
  '[{"input": "()[]{}", "output": "Valid"}, {"input": "(]", "output": "Invalid"}]', 
  '#include <iostream>\n#include <stack>\nusing namespace std;\nbool isValid(string s) {\n  // Your code here\n}\nint main() {\n  string s;\n  cin >> s;\n  cout << (isValid(s) ? "Valid" : "Invalid") << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static boolean isValid(String s) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.next();\n    System.out.println(isValid(s) ? "Valid" : "Invalid");\n    sc.close();\n  }\n}'
),
(
  'Largest Rectangle in Histogram', 
  'Given an array representing the heights of histogram bars, find the area of the largest rectangle that can be formed.',
  'Hard', 
  ARRAY['Stack', 'Array', 'Monotonic Stack'], 
  'First line: an integer n (size of the histogram)\nSecond line: n space-separated integers representing the heights of the histogram bars.', 
  'A single integer representing the area of the largest rectangle.', 
  '[{"input": "6\\n2 1 5 6 2 3", "output": "10"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nint largestRectangleArea(vector<int>& heights) {\n  // Your code here\n}\nint main() {\n  int n;\n  cin >> n;\n  vector<int> heights(n);\n  for (int i = 0; i < n; i++) cin >> heights[i];\n  cout << largestRectangleArea(heights) << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int largestRectangleArea(int[] heights) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] heights = new int[n];\n    for (int i = 0; i < n; i++) heights[i] = sc.nextInt();\n    System.out.println(largestRectangleArea(heights));\n    sc.close();\n  }\n}'
),
(
  'Subset Sum', 
  'Given an array of integers and a target sum, generate all subsets(contiguous) whose sum equals the target.',
  'Medium', 
  ARRAY['Recursion', 'Backtracking'], 
  'First line: an integer n (size of the array)\nSecond line: n space-separated integers representing the array elements\nThird line: an integer target (sum to be achieved).', 
  'Each line contains a subset whose sum equals the target, with elements space-separated. If no subset exists, print "No subset found".', 
  '[{"input": "4\\n2 3 5 6\\n8", "output": "2 6\\n3 5"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nvoid findSubsets(vector<int>& nums, int target, vector<int>& subset, int index) {\n  // Your code here\n}\nint main() {\n  int n, target;\n  cin >> n;\n  vector<int> nums(n);\n  for (int i = 0; i < n; i++) cin >> nums[i];\n  cin >> target;\n  vector<int> subset;\n  findSubsets(nums, target, subset, 0);\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static void findSubsets(int[] nums, int target, List<Integer> subset, int index) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    int target = sc.nextInt();\n    findSubsets(nums, target, new ArrayList<>(), 0);\n    sc.close();\n  }\n}'
),
(
  'Word Search', 
  'Given a 2D grid of characters and a word, determine if the word exists in the grid by tracing adjacent (up, down, left, right) cells.',
  'Medium', 
  ARRAY['Recursion', 'Backtracking', 'DFS'], 
  'First line: two integers m and n (grid dimensions)\nNext m lines: n space-separated characters representing the grid\nLast line: a string word to be searched.', 
  'A single string: "Word found" if the word exists in the grid, otherwise "Word not found".', 
  '[{"input": "3 4\\nA B C E\\nS F C S\\nA D E E\\nABCCED", "output": "Word found"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nbool exist(vector<vector<char>>& board, string word) {\n  // Your code here\n}\nint main() {\n  int m, n;\n  cin >> m >> n;\n  vector<vector<char>> board(m, vector<char>(n));\n  for (int i = 0; i < m; i++)\n    for (int j = 0; j < n; j++)\n      cin >> board[i][j];\n  string word;\n  cin >> word;\n  cout << (exist(board, word) ? "Word found" : "Word not found") << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static boolean exist(char[][] board, String word) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int m = sc.nextInt(), n = sc.nextInt();\n    char[][] board = new char[m][n];\n    for (int i = 0; i < m; i++)\n      for (int j = 0; j < n; j++)\n        board[i][j] = sc.next().charAt(0);\n    String word = sc.next();\n    System.out.println(exist(board, word) ? "Word found" : "Word not found");\n    sc.close();\n  }\n}'
),
(
  'Climbing Stairs', 
  'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
  'Easy', 
  ARRAY['Dynamic Programming'], 
  'A single integer n, representing the number of stairs.', 
  'A single integer representing the number of distinct ways to climb the stairs.', 
  '[{"input": "3", "output": "3"}, {"input": "5", "output": "8"}]', 
  '#include <iostream>\nusing namespace std;\nint climbStairs(int n) {\n  // Your code here\n}\nint main() {\n  int n;\n  cin >> n;\n  cout << climbStairs(n) << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int climbStairs(int n) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    System.out.println(climbStairs(n));\n    sc.close();\n  }\n}'
),
(
  'Longest Increasing Subsequence', 
  'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
  'Medium', 
  ARRAY['Dynamic Programming'], 
  'First line: an integer n (size of the array)\nSecond line: n space-separated integers representing the array elements.', 
  'A single integer representing the length of the longest increasing subsequence.', 
  '[{"input": "6\\n10 9 2 5 3 7 101 18", "output": "4"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nint lengthOfLIS(vector<int>& nums) {\n  // Your code here\n}\nint main() {\n  int n;\n  cin >> n;\n  vector<int> nums(n);\n  for (int i = 0; i < n; i++) cin >> nums[i];\n  cout << lengthOfLIS(nums) << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int lengthOfLIS(int[] nums) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    System.out.println(lengthOfLIS(nums));\n    sc.close();\n  }\n}'
),
(
  'Jump Game', 
  'Given an array of non-negative integers nums, where each element represents the maximum jump length from that position, determine if you can reach the last index.',
  'Medium', 
  ARRAY['Greedy'], 
  'First line: an integer n (size of the array)\nSecond line: n space-separated integers representing the maximum jump length at each position.', 
  'A single string: "Yes" if the last index is reachable, otherwise "No".', 
  '[{"input": "5\\n2 3 1 1 4", "output": "Yes"}, {"input": "5\\n3 2 1 0 4", "output": "No"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nbool canJump(vector<int>& nums) {\n  // Your code here\n}\nint main() {\n  int n;\n  cin >> n;\n  vector<int> nums(n);\n  for (int i = 0; i < n; i++) cin >> nums[i];\n  cout << (canJump(nums) ? "Yes" : "No") << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static boolean canJump(int[] nums) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] nums = new int[n];\n    for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n    System.out.println(canJump(nums) ? "Yes" : "No");\n    sc.close();\n  }\n}'
),
(
  'Minimum Cost to Connect Ropes', 
  'Given an array of ropes, where each element represents a rope length, connect all the ropes into one rope with minimum cost. The cost of connecting two ropes is equal to the sum of their lengths.', 
  'Hard', 
  ARRAY['Greedy', 'Heap', 'Priority Queue'], 
  'First line: an integer n (number of ropes)\nSecond line: n space-separated integers representing the lengths of ropes.', 
  'A single integer representing the minimum total cost to connect all ropes.', 
  '[{"input": "4\\n4 3 2 6", "output": "29"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nint minCostToConnectRopes(vector<int>& ropes) {\n  // Your code here\n}\nint main() {\n  int n;\n  cin >> n;\n  vector<int> ropes(n);\n  for (int i = 0; i < n; i++) cin >> ropes[i];\n  cout << minCostToConnectRopes(ropes) << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int minCostToConnectRopes(int[] ropes) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int[] ropes = new int[n];\n    for (int i = 0; i < n; i++) ropes[i] = sc.nextInt();\n    System.out.println(minCostToConnectRopes(ropes));\n    sc.close();\n  }\n}'
),
(
  'Number of Islands', 
  'Given an m x n 2D binary grid grid which represents "1" as land and "0" as water, return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
  'Medium', 
  ARRAY['Graph', 'BFS', 'DFS'], 
  'First line: two integers m and n representing the number of rows and columns.\nNext m lines: n space-separated integers (0 or 1) representing the grid.', 
  'A single integer representing the number of islands in the grid.', 
  '[{"input": "4 5\\n1 1 0 0 0\\n1 1 0 0 0\\n0 0 1 0 0\\n0 0 0 1 1", "output": "3"}]', 
  '#include <iostream>\n#include <vector>\nusing namespace std;\nint numIslands(vector<vector<int>>& grid) {\n  // Your code here\n}\nint main() {\n  int m, n;\n  cin >> m >> n;\n  vector<vector<int>> grid(m, vector<int>(n));\n  for (int i = 0; i < m; i++)\n    for (int j = 0; j < n; j++)\n      cin >> grid[i][j];\n  cout << numIslands(grid) << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int numIslands(int[][] grid) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int m = sc.nextInt(), n = sc.nextInt();\n    int[][] grid = new int[m][n];\n    for (int i = 0; i < m; i++)\n      for (int j = 0; j < n; j++)\n        grid[i][j] = sc.nextInt();\n    System.out.println(numIslands(grid));\n    sc.close();\n  }\n}'
),
(
  'Dijkstra’s Algorithm', 
  'Given a weighted graph and a source vertex, find the shortest path from the source to all vertices using Dijkstra’s algorithm.',
  'Medium', 
  ARRAY['Graph', 'Dijkstra', 'Priority Queue'], 
  'First line: two integers V and E representing the number of vertices and edges.\nNext E lines: three integers u, v, w representing an edge from u to v with weight w.\nLast line: an integer S representing the source vertex.', 
  'V space-separated integers representing the shortest distance from the source to each vertex.', 
  '[{"input": "5 6\\n0 1 2\\n0 2 4\\n1 2 1\\n1 3 7\\n2 4 3\\n3 4 1\\n0", "output": "0 2 3 9 6"}]', 
  '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nvector<int> dijkstra(int V, vector<vector<pair<int, int>>>& adj, int S) {\n  // Your code here\n}\nint main() {\n  int V, E;\n  cin >> V >> E;\n  vector<vector<pair<int, int>>> adj(V);\n  for (int i = 0; i < E; i++) {\n    int u, v, w;\n    cin >> u >> v >> w;\n    adj[u].push_back({v, w});\n    adj[v].push_back({u, w});\n  }\n  int S;\n  cin >> S;\n  vector<int> dist = dijkstra(V, adj, S);\n  for (int d : dist) cout << d << " ";\n  cout << endl;\n  return 0;\n}', 
  'import java.util.*;\nclass Main {\n  public static int[] dijkstra(int V, List<List<int[]>> adj, int S) {\n    // Your code here\n  }\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int V = sc.nextInt(), E = sc.nextInt();\n    List<List<int[]>> adj = new ArrayList<>();\n    for (int i = 0; i < V; i++) adj.add(new ArrayList<>());\n    for (int i = 0; i < E; i++) {\n      int u = sc.nextInt(), v = sc.nextInt(), w = sc.nextInt();\n      adj.get(u).add(new int[]{v, w});\n      adj.get(v).add(new int[]{u, w});\n    }\n    int S = sc.nextInt();\n    int[] dist = dijkstra(V, adj, S);\n    for (int d : dist) System.out.print(d + \" \");\n    System.out.println();\n    sc.close();\n  }\n}'
),
(
  'Implement Trie (Prefix Tree)', 
  'Design a Trie data structure that supports inserting words, searching for exact words, and checking if a prefix exists in the Trie.',
  'Medium', 
  ARRAY['Trie', 'Prefix Tree'], 
  'First line: an integer n representing the number of operations.\nNext n lines: a string representing the operation (insert, search, startsWith) followed by a word.', 
  'For search operations, output "true" or "false". For startsWith operations, output "true" or "false".', 
  '[{"input": "5\\ninsert apple\\nsearch apple\\nsearch app\\nstartsWith app\\ninsert app", "output": "true\\nfalse\\ntrue"}]', 
  '#include <iostream>\n#include <unordered_map>\nusing namespace std;\nclass Trie {\npublic:\n    Trie() {}\n    void insert(string word) {}\n    bool search(string word) {}\n    bool startsWith(string prefix) {}\n};\nint main() {\n    int n;\n    cin >> n;\n    Trie trie;\n    while (n--) {\n        string op, word;\n        cin >> op >> word;\n        if (op == "insert") trie.insert(word);\n        else if (op == "search") cout << (trie.search(word) ? "true" : "false") << endl;\n        else if (op == "startsWith") cout << (trie.startsWith(word) ? "true" : "false") << endl;\n    }\n    return 0;\n}', 
  'import java.util.*;\nclass Trie {\n    public Trie() {}\n    public void insert(String word) {}\n    public boolean search(String word) {}\n    public boolean startsWith(String prefix) {}\n}\nclass Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Trie trie = new Trie();\n        while (n-- > 0) {\n            String op = sc.next();\n            String word = sc.next();\n            if (op.equals("insert")) trie.insert(word);\n            else if (op.equals("search")) System.out.println(trie.search(word));\n            else if (op.equals("startsWith")) System.out.println(trie.startsWith(word));\n        }\n        sc.close();\n    }\n}'
) ON CONFLICT (title) DO NOTHING;
  `;
  await pool.query(query);
  console.log("✅ all problems inserted");
}

async function createTestcasesTable() {
  try {
    // First create the table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS testcase (
        testcase_id SERIAL PRIMARY KEY,
        problem_id INT REFERENCES problem(problem_id) ON DELETE CASCADE,
        input TEXT NOT NULL,
        output TEXT NOT NULL
      );
    `;
    await pool.query(createTableQuery);

    // Then add the unique constraint
    try {
      const addConstraintQuery = `
        ALTER TABLE testcase 
        ADD CONSTRAINT unique_testcase 
        UNIQUE (problem_id, input, output);
      `;
      await pool.query(addConstraintQuery);
    } catch (constraintError) {
      // If constraint already exists, that's fine
      if (!constraintError.message.includes("already exists")) {
        throw constraintError;
      }
    }

    console.log("✅ Testcase table and constraints created (if not exists).");
  } catch (error) {
    console.error("Error creating testcases table:", error);
    throw error;
  }
}

async function insertTestcases() {
  const query = `
    INSERT INTO testcase (problem_id, input, output) VALUES
      (1, '4\n2 7 11 15\n9', '0 1'),
      (1, '3\n3 2 4\n6', '1 2'),
      (1, '2\n3 3\n6', '0 1'),
      (1, '5\n1 5 3 7 9\n8', '1 2'),
      (1, '6\n2 3 1 6 4 8\n7', '2 3'),
      (1, '4\n1 2 3 4\n5', '1 2'),
      (1, '5\n10 20 10 40 50\n30', '0 1'),
      (1, '6\n1 6 11 14 8 2\n9', '0 4'),
      (1, '7\n5 2 4 6 3 7 8\n10', '2 3'),
      (1, '4\n4 3 6 2\n8', '2 3'),
      (2, '5\n1 1 1 2 3\n3', '3'),
      (2, '4\n1 2 3 4\n5', '1'),
      (2, '7\n3 4 7 2 -3 1 4\n7', '3'),
      (2, '5\n-1 -1 1 1 0\n0', '4'),
      (2, '6\n1 2 3 -3 1 2 3\n3', '6'),
      (2, '5\n10 2 -2 -20 10\n-10', '3'),
      (2, '7\n2 3 5 -5 2 1 4\n4', '1'),
      (2, '4\n1 1 1 1\n2', '3'),
      (2, '6\n0 0 0 0 0 0\n0', '21'),
      (2, '5\n2 -2 2 -2 2\n0', '6'),
      (3, '4\n1 2 3 4', '24 12 8 6'),
      (3, '5\n5 1 4 2 3', '24 120 30 60 40'),
      (3, '3\n2 3 4', '12 8 6'),
      (3, '6\n1 2 0 4 5 6', '0 0 240 0 0 0'),
      (3, '4\n10 3 5 6', '90 300 180 150'),
      (3, '5\n1 1 1 1 1', '1 1 1 1 1'),
      (3, '5\n-1 1 0 -3 3', '0 0 9 0 0'),
      (3, '6\n2 2 2 2 2 2', '32 32 32 32 32 32'),
      (3, '3\n3 -3 3', '-9 9 -9'),
      (3, '5\n4 5 6 7 8', '1680 1344 1120 960 840'),
      (4, 'abcabcbb', '3'),
      (4, 'bbbbb', '1'),
      (4, 'pwwkew', '3'),
      (4, 'dvdf', '3'),
      (4, 'anviaj', '5'),
      (4, 'abcdefgh', '8'),
      (4, 'aaabbbccc', '2'),
      (4, 'abcbdef', '5'),
      (4, 'aab', '2'),
      (4, 'tmmzuxt', '5'),
      (5, '5\n1 2 3 4 5\n3', '12'),
      (5, '6\n2 1 5 1 3 2\n3', '9'),
      (5, '4\n4 2 1 7\n2', '8'),
      (5, '7\n3 4 1 1 6 2 8\n4', '17'),
      (5, '5\n10 20 30 40 50\n2', '90'),
      (5, '6\n5 5 5 5 5 5\n3', '15'),
      (5, '3\n1 1 1\n2', '2'),
      (5, '8\n2 3 5 1 6 7 8 9\n5', '31'),
      (5, '5\n-1 -2 -3 -4 -5\n2', '-3'),
      (5, '6\n1 2 3 4 -10 5\n3', '9'),
      (6, '7\n4 5 6 7 0 1 2\n0', '4'),
      (6, '6\n6 7 1 2 3 4\n3', '4'),
      (6, '5\n3 4 5 1 2\n1', '3'),
      (6, '8\n10 11 12 1 2 3 4 5\n12', '2'),
      (6, '7\n7 8 9 1 2 3 4\n6', '-1'),
      (6, '6\n2 3 4 5 6 1\n1', '5'),
      (6, '5\n5 6 7 8 9\n7', '2'),
      (6, '6\n15 18 2 3 6 12\n6', '4'),
      (6, '8\n30 40 50 10 20 25 27 28\n20', '4'),
      (6, '4\n2 3 4 1\n1', '3'),
      (7, '3\n1 3 8\n3\n7 9 10', '7.5'),
      (7, '2\n1 2\n2\n3 4', '2.5'),
      (7, '1\n2\n1\n3', '2.5'),
      (7, '4\n1 2 3 4\n4\n5 6 7 8', '4.5'),
      (7, '5\n10 20 30 40 50\n5\n5 15 25 35 45', '27.5'),
      (7, '3\n1 2 3\n2\n4 5', '3.0'),
      (7, '6\n1 5 8 10 12 14\n5\n2 3 6 7 9', '7.0'),
      (7, '2\n1 4\n3\n2 3 5', '3.0'),
      (7, '3\n2 4 6\n4\n1 3 5 7', '4.0'),
      (7, '4\n1 3 5 7\n3\n2 4 6', '4.0'),
      (8, '5\n1 2 3 4 5', '5 4 3 2 1'),
      (8, '3\n10 20 30', '30 20 10'),
      (8, '4\n4 3 2 1', '1 2 3 4'),
      (8, '6\n1 3 5 7 9 11', '11 9 7 5 3 1'),
      (8, '2\n100 200', '200 100'),
      (8, '7\n7 14 21 28 35 42 49', '49 42 35 28 21 14 7'),
      (8, '1\n42', '42'),
      (8, '8\n8 16 24 32 40 48 56 64', '64 56 48 40 32 24 16 8'),
      (8, '4\n-1 -2 -3 -4', '-4 -3 -2 -1'),
      (8, '5\n9 8 7 6 5', '5 6 7 8 9'),
      (9, '5\n1 2 3 4 5\n-1', 'No cycle'),
      (9, '6\n1 2 3 4 5 6\n2', 'Cycle detected'),
      (9, '4\n10 20 30 40\n-1', 'No cycle'),
      (9, '7\n3 6 9 12 15 18 21\n0', 'Cycle detected'),
      (9, '5\n5 10 15 20 25\n-1', 'No cycle'),
      (9, '8\n1 2 3 4 5 6 7 8\n3', 'Cycle detected'),
      (9, '2\n100 200\n-1', 'No cycle'),
      (9, '9\n11 22 33 44 55 66 77 88 99\n5', 'Cycle detected'),
      (9, '3\n7 14 21\n-1', 'No cycle'),
      (9, '6\n9 8 7 6 5 4\n2', 'Cycle detected'),
      (10, '(){}[]', 'Valid'),
      (10, '({[]})', 'Valid'),
      (10, '({[)]}', 'Invalid'),
      (10, '((()))', 'Valid'),
      (10, '(()))', 'Invalid'),
      (10, '[()]{()}', 'Valid'),
      (10, '{[()]}', 'Valid'),
      (10, '([)]', 'Invalid'),
      (10, '{[()()][]}', 'Valid'),
      (10, '({)}', 'Invalid'),
      (11, '6\n2 1 5 6 2 3', '10'),
      (11, '4\n2 4 2 1', '6'),
      (11, '5\n1 2 3 4 5', '9'),
      (11, '7\n6 2 5 4 5 1 6', '12'),
      (11, '3\n3 3 3', '9'),
      (11, '8\n2 1 4 5 1 3 3 2', '8'),
      (11, '6\n3 1 3 2 2 4', '8'),
      (11, '5\n5 4 3 2 1', '9'),
      (11, '9\n1 2 3 4 5 6 7 8 9', '25'),
      (11, '10\n2 1 2 3 1 4 2 3 1 2', '10'),
      (12, '5 \n2 3 5 6 8\n10', '2 3 5'),
      (12, '4\n1 2 3 4\n7', '3 4'),
      (12, '6\n3 34 4 12 5 2\n9', 'No subset found'),
      (12, '3\n1 2 3\n5', '2 3'),
      (12, '5\n1 2 3 4 5\n6', '1 2 3'),
      (12, '4\n7 3 2 5\n10', '7 3 \n3 2 5'),
      (12, '6\n1 5 3 7 4 2\n8', '5 3'),
      (12, '3\n2 2 2\n4', '2 2 \n2 2'),
      (12, '5\n5 10 12 13 15\n15', '5 10 \n15'),
      (12, '4\n9 1 3 5\n11', 'No subset found'),
      (13, '3 4\nA B C E\nS F C S\nA D E E\nABCCED', 'Word found'),
      (13, '3 4\nA B C E\nS F C S\nA D E E\nSEE', 'Word found'),
      (13, '3 4\nA B C E\nS F C S\nA D E E\nABCB', 'Word not found'),
      (13, '2 2\nA B\nC D\nACDB', 'Word found'),
      (13, '3 3\nC A T\nD O G\nR A T\nCATDOG', 'Word not found'),
      (13, '4 4\nH E L L\nO W O R\nL D A B\nC D E F\nHELLOWORLD', 'Word not found'),
      (13, '3 3\nX Y Z\nA B C\nD E F\nXYZABC', 'Word not found'),
      (13, '3 3\nA A A\nA A A\nA A A\nAAA', 'Word found'),
      (13, '3 4\nM A T H\nI S F U\nN F O R\nY O U\nMATHFUN', 'Word not found'),
      (13, '4 4\nP A T H\nF I N D\nS E A R\nC H X Y\nSEARCH', 'Word not found'),
      (14, '2', '2'),
      (14, '3', '3'),
      (14, '4', '5'),
      (14, '5', '8'),
      (14, '6', '13'),
      (14, '7', '21'),
      (14, '8', '34'),
      (14, '9', '55'),
      (14, '10', '89'),
      (14, '15', '987'),
      (15, '8\n10 9 2 5 3 7 101 18', '4'),
      (15, '6\n0 1 0 3 2 3', '4'),
      (15, '8\n7 7 7 7 7 7 7 7', '1'),
      (15, '7\n1 3 6 7 9 4 10', '6'),
      (15, '6\n2 2 2 2 2 2', '1'),
      (15, '5\n1 2 3 4 5', '5'),
      (15, '7\n5 8 3 7 9 1 6', '3'),
      (15, '9\n1 5 2 3 4 6 7 8 9', '8'),
      (15, '4\n10 20 30 10', '3'),
      (15, '6\n3 10 2 1 20 30', '4'),
      (16, '5\n2 3 1 1 4', 'Yes'),
      (16, '5\n3 2 1 0 4', 'No'),
      (16, '6\n2 3 0 1 4 2', 'Yes'),
      (16, '4\n1 1 1 1', 'Yes'),
      (16, '4\n1 2 3 4', 'Yes'),
      (16, '5\n3 2 1 0 1', 'No'),
      (16, '6\n2 0 2 0 1 4', 'Yes'),
      (16, '7\n2 3 1 1 0 2 4', 'No'),
      (16, '5\n2 5 0 0 1', 'Yes'),
      (16, '4\n0 1 2 3', 'No'),
      (17, '4\n4 3 2 6', '29'),
      (17, '5\n1 2 3 4 5', '33'),
      (17, '3\n8 4 6', '28'),
      (17, '6\n10 20 30 40 50 60', '510'),
      (17, '2\n100 200', '300'),
      (17, '7\n5 2 9 3 7 4 6', '97'),
      (17, '1\n15', '0'),
      (17, '5\n1 10 1 10 1', '41'),
      (17, '4\n8 8 8 8', '64'),
      (17, '6\n2 2 2 2 2 2', '32'),
      (18, '4 5\n1 1 0 0 0\n1 1 0 0 1\n0 0 1 0 1\n0 0 0 1 1', '3'),
      (18, '3 3\n1 1 1\n0 1 0\n1 1 1', '1'),
      (18, '4 4\n1 0 0 1\n0 1 1 0\n0 0 0 1\n1 1 0 0', '5'),
      (18, '5 5\n1 1 0 0 1\n1 1 0 1 1\n0 0 1 0 0\n1 0 0 1 1\n1 1 1 0 0', '5'),
      (18, '3 4\n1 1 0 1\n0 0 1 0\n1 0 0 1', '5'),
      (18, '2 2\n1 1\n1 1', '1'),
      (18, '3 3\n0 0 0\n0 0 0\n0 0 0', '0'),
      (18, '4 4\n1 0 1 0\n0 1 0 1\n1 0 1 0\n0 1 0 1', '8'),
      (18, '5 5\n1 0 1 0 1\n0 1 0 1 0\n1 0 1 0 1\n0 1 0 1 0\n1 0 1 0 1', '13'),
      (18, '3 3\n1 0 1\n0 1 0\n1 0 1', '5'),
      (19, '5 6\n0 1 10\n0 2 3\n1 2 1\n1 3 2\n2 3 8\n3 4 4\n0', '0 4 3 6 10'),
      (19, '4 4\n0 1 5\n0 2 10\n1 3 2\n2 3 1\n0', '0 5 8 7'),
      (19, '6 7\n0 1 4\n0 2 2\n1 2 5\n1 3 10\n2 4 3\n3 4 6\n4 5 1\n0', '0 4 2 11 5 6'),
      (19, '3 3\n0 1 7\n0 2 9\n1 2 1\n0', '0 7 8'),
      (19, '5 7\n0 1 2\n0 2 9\n1 2 6\n1 3 3\n2 3 7\n2 4 5\n3 4 1\n0', '0 2 8 5 6'),
      (19, '4 5\n0 1 8\n0 2 4\n1 2 1\n1 3 9\n2 3 2\n0', '0 5 4 6'),
      (19, '6 9\n0 1 1\n0 2 2\n1 2 1\n1 3 4\n2 3 2\n2 4 7\n3 4 3\n3 5 5\n4 5 1\n0', '0 1 2 4 7 8'),
      (19, '3 2\n0 1 3\n1 2 6\n0', '0 3 9'),
      (19, '5 6\n0 1 3\n0 2 6\n1 2 2\n1 3 1\n2 3 5\n3 4 7\n0', '0 3 5 4 11'),
      (19, '4 4\n0 1 2\n0 2 7\n1 3 3\n2 3 2\n0', '0 2 7 5'),
      (20, '5\ninsert apple\nsearch apple\nsearch app\nstartsWith app\ninsert app', 'true\nfalse\ntrue'),
      (20, '4\ninsert hello\ninsert hell\nsearch hello\nstartsWith he', 'true\ntrue'),
      (20, '6\ninsert data\ninsert structure\nsearch data\nsearch struct\nstartsWith struct\nstartsWith data', 'true\nfalse\ntrue\ntrue'),
      (20, '7\ninsert code\ninsert coder\nsearch cod\nsearch coder\nstartsWith co\nstartsWith code\nsearch code', 'false\ntrue\ntrue\ntrue\ntrue'),
      (20, '3\ninsert abc\nsearch ab\nstartsWith a', 'false\ntrue'),
      (20, '8\ninsert test\ninsert testing\ninsert tester\nsearch test\nsearch testing\nsearch tested\nstartsWith tes\nstartsWith tester', 'true\ntrue\nfalse\ntrue\ntrue'),
      (20, '5\ninsert banana\ninsert band\nsearch ban\nstartsWith ban\nsearch band', 'false\ntrue\ntrue'),
      (20, '6\ninsert car\ninsert cat\nsearch cap\nstartsWith ca\nsearch cat\nsearch car', 'false\ntrue\ntrue\ntrue'),
      (20, '4\ninsert mobile\nsearch mob\nstartsWith mob\nsearch mobile', 'false\ntrue\ntrue'),
      (20, '5\ninsert tree\ninsert trie\nsearch tree\nsearch trie\nstartsWith tr', 'true\ntrue\ntrue') ON CONFLICT (problem_id, input, output) DO NOTHING;
  `;
  await pool.query(query);
  console.log("✅ Testcases inserted");
}

async function createProgressTable() {
  const query = `
  CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    total_submissions INT DEFAULT 0,
    correct_submissions INT DEFAULT 0,
    accuracy FLOAT DEFAULT 0,
    problems_solved INT DEFAULT 0
  );
`;
  await pool.query(query);
  console.log("✅ Progress table created");
}

async function createSubmissionsTable() {
  const query = `
  CREATE TABLE IF NOT EXISTS submissions (
    submission_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id INT REFERENCES problem(problem_id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(20) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Passed', 'Failed')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
  await pool.query(query);
  console.log("✅ Submissions table created");
}

async function initDB() {
  await createUsersTable();
  await createProblemsTable();
  await insertProblems();
  await createTestcasesTable();
  await insertTestcases();
  await createProgressTable();
  await createSubmissionsTable();
}

module.exports = { pool, initDB };

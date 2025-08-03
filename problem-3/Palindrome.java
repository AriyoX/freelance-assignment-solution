// longest palindromic substring in a string solution but in java

public class Palindrome{

    private static int start = 0;
    private static int maxLength = 0;

    public static String longestPalindrome_ExpandAroundCenter(String s) {
        if (s == null || s.length() < 1) {
            return "";
        }
        
        start = 0;
        maxLength = 0;

        for (int i = 0; i < s.length(); i++) {
            // odd length palindromes (center is at i)
            expandAroundCenter(s, i, i);
            
            // even length palindromes (center is between i and i+1)
            expandAroundCenter(s, i, i + 1);
        }

        return s.substring(start, start + maxLength);
    }

    private static void expandAroundCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
       
        int currentLength = right - left - 1;
        if (currentLength > maxLength) {
            maxLength = currentLength;
            start = left + 1;
        }
    }

    public static void main(String[] args) {
        String test = "banana";
        System.out.println("Expand Around Center Result: " + longestPalindrome_ExpandAroundCenter(test));
    }
}
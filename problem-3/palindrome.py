# python solution for finding the longest palindromic substring
# expand around center includes checking iterating characters deemec as the centre, expanding around them and saving the longest palindrome found
# in the case of even length palindromes, we deem the center to be between two characters
# this solution has a time complexity of O(n^2), better thn the brute force O(n^3) solution

class Solution:
    def longestPalindrome(self, s: str) -> str:
        result = ""
        result_length = 0

        for i in range(len(s)):
            # odd length palindromes
            left, right = i, i
            while left >= 0 and right < len(s) and s[left] == s[right]:
                if (right - left + 1) > result_length:
                    result = s[left:right + 1]
                    result_length = right - left + 1
                left -= 1
                right += 1

            # even length palindromes
            left, right = i, i + 1
            while left >= 0 and right < len(s) and s[left] == s[right]:
                if (right - left + 1) > result_length:
                    result = s[left:right + 1]
                    result_length = right - left + 1
                left -= 1
                right += 1

        return result
                    
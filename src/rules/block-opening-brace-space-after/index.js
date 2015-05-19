import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-opening-brace-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \"{\"",
  rejectedAfter: () => "Unexpected space after \"{\"",
  expectedAfterSingleLine: () => "Expected single space after \"{\" of a single-line block",
  rejectedAfterSingleLine: () => "Unexpected space after \"{\" of a single-line block",
  expectedAfterMultiLine: () => "Expected single space after \"{\" of a multi-line block",
  rejectedAfterMultiLine: () => "Unexpected space after \"{\" of a multi-line block",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return blockOpeningBraceSpaceChecker(checker.after)
}

export function blockOpeningBraceSpaceChecker(checkLodation) {
  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      const blockString = block.toString()
      for (let i = 0, l = blockString.length; i < l; i++) {
        if (blockString[i] !== "{") { continue }
        // Only pay attention to the first brace encountered
        checkBrace(blockString, i, block, blockString.slice(i))
        break
      }
    }

    function checkBrace(str, index, node, lineCheckStr) {
      checkLodation(str, index, m => result.warn(m, { node }), lineCheckStr)
    }
  }
}

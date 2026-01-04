[K-EXAONE_Technical_Report](https://www.lgresearch.ai/data/cdn/upload/K-EXAONE_Technical_Report.pdf)

Authors: LG AI Research

> This technical report presents K-EXAONE, a large-scale multilingual language model developed by LG AI Research. K-EXAONE is built on a Mixture-of-Experts architecture with 236B total parameters, activating 23B parameters during inference. It supports a 256K-token context window and covers six languages: Korean, English, Spanish, German, Japanese, and Vietnamese. We evaluate K-EXAONE on a comprehensive benchmark suite spanning reasoning, agentic, general, Korean, and multilingual abilities. Across these evaluations, K-EXAONE demonstrates performance comparable to open-weight models of similar size. K-EXAONE, designed to advance AI for a better life, is positioned as a powerful proprietary AI foundation model for a wide range of industrial and research applications.

- Strong Performance: Demonstrates impressive results on STEM benchmarks, following the success of DeepSeek and Kimi-style approaches.
- Architecture: Optimized for efficiency using Sliding Window Attention to reduce KV cache overhead, combined with MoE (Mixture of Experts) and the Muon Optimizer.
- Tokenizer & Vocabulary: Expanded vocabulary to 50K tokens specialized for STEM and Code, utilizing SuperBPE for enhanced encoding efficiency.
- Language Support: Extended multilingual capabilities specifically for German, Japanese, and Vietnamese (strategic choice, though specific reasoning remains unclear).
- Training Pipeline: Implements Thinking-Augmented Data Synthesis followed by Post-RL Preference Learning.
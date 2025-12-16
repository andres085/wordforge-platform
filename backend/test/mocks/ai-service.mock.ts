export const createMockAiService = () => ({
  generateVocabulary: jest.fn().mockResolvedValue([
    {
      position: 1,
      category: 'Phrasal verbs',
      term: 'come across',
      definition: 'find by chance or seem/appear',
      example: 'I came across an interesting article yesterday.',
    },
    {
      position: 2,
      category: 'Fixed expressions',
      term: 'for the time being',
      definition: 'temporarily, for now',
      example: "For the time being, I'll work from home.",
    },
    {
      position: 3,
      category: 'Binomials',
      term: 'pros and cons',
      definition: 'advantages and disadvantages',
      example: "Let's weigh the pros and cons before deciding.",
    },
    {
      position: 4,
      category: 'Proverbs/sayings',
      term: 'Better late than never',
      definition: "it's better to do something late than not at all",
      example: 'I finally finished the book—better late than never!',
    },
    {
      position: 5,
      category: 'Discourse markers',
      term: 'having said that',
      definition: 'however, but',
      example: 'The movie was long. Having said that, it was entertaining.',
    },
    {
      position: 6,
      category: 'Register-specific vocabulary',
      term: 'get in touch',
      definition: 'contact',
      example: 'Feel free to get in touch if you have questions.',
    },
  ]),

  generateVocabularyItem: jest.fn().mockResolvedValue({
    category: 'Phrasal verbs',
    term: 'run into',
    definition: 'meet by chance',
    example: 'I ran into an old friend at the supermarket.',
  }),
});

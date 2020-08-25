import { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

// TODO: it uses stuff from the journal in order to create the entry and
//       update the local cache, will need much refactor!
import {
  LOAD_JOURNAL_NOTES,
  INSERT_JOURNAL_NOTE
} from "./use-journal-notes/lib/graphql";
import { updateCacheAfterCreate } from "./use-journal-notes/lib/cache";
import { DEFAULT_OPTIONS } from "./use-journal-notes/entries";

export const DOWNLOAD_MINDFUL_QUESTIONS = gql`
  query downloadMindfulQuestions($lang: String!, $bucket: String) {
    mindful_questions(
      where: { lang: { _eq: $lang }, bucket: { _eq: $bucket } }
    ) {
      id
      lang
      text
      type
      data
      bucket
    }
  }
`;

const useMindfulQuestions = () => {
  const history = useHistory();
  const [question, setQuestion] = useState(null);
  const [bucket, setBucket] = useState("quick");

  const { loading, data } = useQuery(DOWNLOAD_MINDFUL_QUESTIONS, {
    fetchPolicy: "cache-first",
    variables: { lang: "en", bucket }
  });

  const [createNote] = useMutation(INSERT_JOURNAL_NOTE, {
    update: updateCacheAfterCreate({
      query: LOAD_JOURNAL_NOTES,
      variables: { limit: DEFAULT_OPTIONS.limit, offset: 0 }
    })
  });

  const shuffle = () => {
    const randomIndex =
      Math.floor(Math.random() * (data.mindful_questions.length - 1)) + 0;
    setQuestion(data.mindful_questions[randomIndex]);
  };

  const create = async () => {
    const text = `### ${question.text}\n\n`;
    const variables = {
      text,
      tags: `{mindful-question, ${question.bucket}-bucket}`,
      data: { question }
    };
    const res = await createNote({ variables });
    history.push(
      `/journal/${res.data.insert_journal_notes.returning[0].id}/edit`
    );
  };

  // re-shuffle at boot time or when the dataset changes
  useEffect(() => {
    if (loading || !data || !data.mindful_questions.length) return;
    shuffle();
  }, [loading, data]); // eslint-disable-line

  return { loading, question, bucket, setBucket, shuffle, create };
};

export default useMindfulQuestions;

import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import useAuth from "../../hooks/use-auth";
import {
  LOAD_JOURNAL_NOTE,
  UPDATE_JOURNAL_NOTE,
  INSERT_JOURNAL_NOTE,
  LOAD_JOURNAL_NOTES
} from "./lib/graphql";
import { updateCacheAfterCreate } from "./lib/cache";
import { DEFAULT_OPTIONS } from "./entries";

export const NEW_ITEM_ID = "$new";

// const INITIAL_VALUES = { id: NEW_ITEM_ID, text: "", tags: ["free-text"] };
// const noop = () => {};

const useJournalNotesUpsert = (noteId, options = DEFAULT_OPTIONS) => {
  const auth = useAuth();
  const history = useHistory();

  const timerRef = useRef(null);

  const [isReady, setIsReady] = useState(noteId === NEW_ITEM_ID);

  const [initialValues, setInitialValues] = useState({
    id: noteId,
    text: "",
    tags: [],
    data: null
  });

  const [values, setValues] = useState({
    id: noteId,
    text: "",
    tags: [],
    data: null
  });

  const {
    // loading: noteIsLoading,
    data: noteData,
    error: noteError
  } = useQuery(LOAD_JOURNAL_NOTE, {
    variables: { noteId }
    // fetchPolicy: "network-only"
  });

  const [updateNote] = useMutation(UPDATE_JOURNAL_NOTE);

  const [createNote] = useMutation(INSERT_JOURNAL_NOTE, {
    update: updateCacheAfterCreate({
      query: LOAD_JOURNAL_NOTES,
      variables: { limit: options.limit, offset: 0 }
    })
  });

  const hasChanges = useMemo(() => {
    // console.log("@@hasChanges", values.text !== initialValues.text);
    return values.text !== initialValues.text;
  }, [values, initialValues]);

  const submit = async () => {
    try {
      // console.log("@submit", initialValues.id);
      const { id } = initialValues;
      if (id === NEW_ITEM_ID) {
        const { text, tags } = values;

        // skip an empty value
        if (!text.length) {
          // console.log("Empty text on a new note, skipping...");
          return;
        }
        const variables = { text, tags: `{${tags.join(",")}}` };
        // console.log("@create", variables);
        const res = await createNote({ variables });
        // console.log(res);
        setInitialValues(res.data.insert_journal_notes.returning[0]);
      } else {
        const { text, tags } = values;
        const variables = { noteId: id, text, tags: `{${tags.join(",")}}` };
        // console.log("@update", variables);
        const res = await updateNote({ variables });
        setInitialValues(res.data.update_journal_notes.returning[0]);
      }
    } catch (err) {
      console.error("@@submit", err.message);
    }
  };

  // First data load
  useEffect(() => {
    if (!noteData) return;
    if (isReady) return;
    // console.log("@@firstDataLoad", noteData.journal_notes);
    setIsReady(true);
    setInitialValues(noteData.journal_notes[0]);
    setValues(noteData.journal_notes[0]);
  }, [isReady, noteData]);

  // Trigger a debounced submit
  useEffect(() => {
    clearTimeout(timerRef.current);
    if (values.text !== initialValues.text) {
      timerRef.current = setTimeout(submit, 500);
    }
  }, [values, initialValues]); // eslint-disable-line

  // Forces logout in case of missing token
  useEffect(() => {
    if (
      noteError &&
      noteError.message.includes('field "journal_notes" not found')
    ) {
      auth.logout();
      history.push("/login");
    }
  }, [noteError]);

  return {
    submit,
    isReady,
    title: values.text.length ? values.text.substring(0, 20) : "New Note",
    hasChanges,
    values: {
      text: {
        options: {
          readonly: false,
          autocapitalize: true
        },
        value: values.text,
        update: (text) => setValues({ ...values, text })
      }
    }
  };
};

export default useJournalNotesUpsert;

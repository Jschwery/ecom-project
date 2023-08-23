import { TextField } from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { format } from "date-fns";
import { Box, Typography, Button, Modal } from "@mui/material";
import { addDays } from "date-fns";
import { useState } from "react";
import { colors } from "../styles/colors";

export default function InfoForm({
  open,
  handleClose,
  headerText,
  functionCallback,
}) {
  const [eventName, setName] = useState("");
  const [eventDetail, setDetail] = useState("");
  const [eventDate, setDate] = useState("");
  const [eventLocation, setLocation] = useState("");

  const [submittedError, setSubmittedError] = useState("");

  const checkoutSchema = yup.object().shape({
    eventName: yup.string().required("Event Name is required"),
    eventDetail: yup.string().required("Event Detail is required"),
    eventDate: yup
      .date()
      .required("Date is required")
      .min(new Date(), "Date cannot be in the past"),
    eventLocation: yup.string().required("Location is required"),
  });

  const formContainerStyle = {
    margin: "20px 20px",
    display: "flex",
    justifyContent: "center",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    bgcolor: `${colors.red[300]}`,
    border: `2px solid ${colors.red[100]}`,
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
    maxWidth: "600px",
  };

  const handleFormSubmit = (values) => {
    if (
      eventName !== "" &&
      eventDetail !== "" &&
      eventDate !== "" &&
      eventLocation !== ""
    ) {
      functionCallback(
        eventName,
        eventDetail,
        format(addDays(new Date(eventDate), 2), "yyyy-MM-dd"),
        eventLocation,
        true
      );
      setName("");
      setDetail("");
      setDate("");
      setLocation("");
      handleClose();
    } else {
      setSubmittedError(true);
    }
  };

  format(addDays(new Date(), 1), "yyyy-MM-dd");

  const handleEventName = (event) => {
    setSubmittedError(false);
    setName(event.target.value);
  };
  const handleEventDetail = (event) => {
    setSubmittedError(false);
    setDetail(event.target.value);
  };
  const handleEventDate = (event) => {
    setSubmittedError(false);
    setDate(event.target.value);
  };

  const handleEventLocation = (event) => {
    setSubmittedError(false);
    setLocation(event.target.value);
  };

  return (
    <Box sx={formContainerStyle}>
      <Box sx={formStyle}>
        <Typography
          sx={{ color: colors.blue[300] }}
          variant="h2"
          component="h2"
        >
          {headerText}
        </Typography>
        <Formik
          initialValues={{
            eventName: "",
            eventDetail: "",
            eventDate: "",
            eventLocation: "",
          }}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched }) => (
            <Form className=" bg-slate-400 flex flex-col">
              <Box sx={{ py: "10px" }}>
                <Field
                  as={TextField}
                  style={{ width: "100%" }} // Add this line
                  required
                  name="eventName"
                  label="Field 1"
                  variant="outlined"
                  placeholder="event name"
                />
                {errors.eventName && touched.eventName ? (
                  <div>{errors.eventName}</div>
                ) : null}
              </Box>
              <Box sx={{ py: "10px", flexGrow: "1" }}>
                <Field
                  as={TextField}
                  style={{ width: "100%" }}
                  required
                  name="eventDetail"
                  label="Field 2"
                  variant="outlined"
                  placeholder="event detail"
                />
                {errors.eventDetail && touched.eventDetail ? (
                  <div>{errors.eventDetail}</div>
                ) : null}
              </Box>
              <Box sx={{ py: "10px" }}>
                <Field
                  as={TextField}
                  style={{ width: "100%" }}
                  required
                  name="eventDate"
                  label="Field 3"
                  variant="outlined"
                  placeholder="event date"
                  type="date"
                />
                {errors.eventDate && touched.eventDate ? (
                  <div>{errors.eventDate}</div>
                ) : null}
              </Box>
              <Box sx={{ py: "10px" }}>
                <Field
                  as={TextField}
                  style={{ width: "100%" }}
                  required
                  name="eventLocation"
                  label="Field 4"
                  variant="outlined"
                  placeholder="event location"
                />
                {errors.eventLocation && touched.eventLocation ? (
                  <div>{errors.eventLocation}</div>
                ) : null}
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  style={{
                    backgroundColor: `${colors.red[400]}`,
                    color: `${colors.blue[100]}`,
                  }}
                  variant="contained"
                  type="submit"
                >
                  Create Event
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

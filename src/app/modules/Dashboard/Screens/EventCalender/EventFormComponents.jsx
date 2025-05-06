

import React from "react";
import { format, parseISO } from "date-fns";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import { TextInput } from "components/FormControl";
import DateInput from "components/FormControl/DateInput";
import {
  SheetCardExtension,
  DetailBox,
  DetailCard,
} from "components/SheetCardExtension";

// View Event Component
export const ViewEventComponent = ({
  selectedEvent,
  selectedDate,
  isHR,
  setViewMode,
  setIsEventSheetOpen,
  setIsDeleteDialogOpen,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg font-medium">{selectedEvent?.name}</div>
        {isHR && (
          <Button variant="outline" onClick={() => setViewMode(false)}>
            Edit Event
          </Button>
        )}
      </div>

      <DetailCard
        detailCardTitle="Event Details"
        date={selectedEvent?.created_at}
      >
        <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px]">
          <DetailBox
            label="Event Date"
            value={selectedDate && format(selectedDate, "MMMM dd, yyyy")}
          />

          {selectedEvent?.start_date && (
            <DetailBox
              label="Start Date"
              value={format(
                parseISO(selectedEvent.start_date),
                "MMMM dd, yyyy"
              )}
            />
          )}

          {selectedEvent?.end_date && (
            <DetailBox
              label="End Date"
              value={format(parseISO(selectedEvent.end_date), "MMMM dd, yyyy")}
            />
          )}

          {selectedEvent?.event_location && (
            <DetailBox label="Location" value={selectedEvent.event_location} />
          )}

          {selectedEvent?.description && (
            <DetailBox label="Description" value={selectedEvent.description} />
          )}
        </div>
      </DetailCard>

      <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
        <Button
          variant="outline"
          type="button"
          size="lg"
          onClick={() => setIsEventSheetOpen(false)}
        >
          Close
        </Button>
        {isHR && selectedEvent && !selectedEvent.system && (
          <Button
            type="button"
            size="lg"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        )}
      </div>
    </>
  );
};

// Edit Event Form Component
export const EditEventFormComponent = ({
  selectedEvent,
  selectedDate,
  handleEventSubmit,
  handleClose,
  validateEventForm,
  getEventInitialValues,
  setIsDeleteDialogOpen,
}) => {
  return (
    <Formik
      initialValues={getEventInitialValues(selectedEvent, selectedDate)}
      validate={validateEventForm}
      enableReinitialize={true}
      onSubmit={handleEventSubmit}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
          <SheetCardExtension title="Event Details">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Date: {selectedDate && format(selectedDate, "MMMM dd, yyyy")}
              </p>
            </div>

            <TextInput
              name="name"
              error={props.errors?.name}
              touch={props.touched?.name}
              value={props.values?.name}
              label="Event Name"
              required={true}
              onChange={(field, value) => {
                props.handleChange(field)(value);
              }}
              placeholder="Enter event name"
            />

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <DateInput
                  name="start_date"
                  error={props.errors?.start_date}
                  touch={props.touched?.start_date}
                  value={props.values?.start_date}
                  label="Start Date"
                  required={true}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                  showMonthYearPicker={false}
                />
              </div>
              <div className="flex-1 space-y-2">
                <DateInput
                  name="end_date"
                  error={props.errors?.end_date}
                  touch={props.touched?.end_date}
                  value={props.values?.end_date}
                  label="End Date"
                  required={true}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                  showMonthYearPicker={false}
                />
              </div>
            </div>

            <TextInput
              name="event_location"
              error={props.errors?.event_location}
              touch={props.touched?.event_location}
              value={props.values?.event_location}
              label="Event Location"
              required={false}
              onChange={(field, value) => {
                props.handleChange(field)(value);
              }}
            />

            <TextInput
              name="description"
              error={props.errors?.description}
              touch={props.touched?.description}
              value={props.values?.description}
              label="Description"
              required={false}
              onChange={(field, value) => {
                props.handleChange(field)(value);
              }}
            />
          </SheetCardExtension>

          <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
            {selectedEvent && !selectedEvent.system && (
              <Button
                type="button"
                size="lg"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            )}
            <div className="flex-1"></div>
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              variant="default"
              disabled={props.isSubmitting}
            >
              {props.isSubmitting ? "Saving..." : "Save Event"}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

import "./application.js";

import BannerPickerController from './banner_picker_controller.js';
import DeletableController from './deletable_controller.js';
import ChapterEditorController from './chapter_editor_controller.js';
import ChapterPresenterController from './chapter_presenter_controller.js';
import DialogController from './dialog_controller.js';
import TextareaResizeController from './textarea_resize_controller.js';
import TrackSheetManagerController from './track_sheet_manager_controller.js';
import TrackSheetUpdatesDisplayRendererController from './track_sheet_updates_display_renderer_controller.js';
import TrackSheetUpdatesEditRendererController from './track_sheet_updates_edit_renderer_controller.js';
import TrackerPickerController from './tracker_picker_controller.js';
import TrackerPickerServiceController from './tracker_picker_service_controller.js';
import TriggerController from './trigger_controller.js';

Stimulus.register("banner-picker", BannerPickerController);
Stimulus.register("deletable", DeletableController);
Stimulus.register("chapter-editor", ChapterEditorController);
Stimulus.register("chapter-presenter", ChapterPresenterController);
Stimulus.register("dialog", DialogController);
Stimulus.register("textarea-resize", TextareaResizeController);
Stimulus.register("track-sheet-manager", TrackSheetManagerController);
Stimulus.register("track-sheet-updates-display-renderer", TrackSheetUpdatesDisplayRendererController);
Stimulus.register("track-sheet-updates-edit-renderer", TrackSheetUpdatesEditRendererController);
Stimulus.register("tracker-picker", TrackerPickerController);
Stimulus.register("tracker-picker-service", TrackerPickerServiceController);
Stimulus.register("trigger", TriggerController);

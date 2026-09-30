interface Navigator {
  readonly globalPrivacyControl?: boolean;
}

interface WorkerNavigator {
  readonly doNotTrack?: string | null;
  readonly globalPrivacyControl?: boolean;
}

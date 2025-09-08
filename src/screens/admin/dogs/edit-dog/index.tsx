import React from 'react';
import { Card, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useSearchParams, Link } from 'react-router-dom';
import { DogService, AWSService, DogCharacterService, DogLikeService, BreedService } from '@/services';
import { showError, showSuccess, handleApiError } from '@/utils/sweetAlert';
import { IMAGES } from '@/contants/images';

const EditDog: React.FC = () => {
    const [searchParams] = useSearchParams();
    const dogId = searchParams.get('id');

    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    // const [dog, setDog] = React.useState<any>(null);

    // Form state
    const [dogName, setDogName] = React.useState('');
    const [breed, setBreed] = React.useState<string>('');
    const [gender, setGender] = React.useState<string>('male');
    const [age, setAge] = React.useState<number | ''>('');
    const [colour, setColour] = React.useState<string>('');
    const [character, setCharacter] = React.useState<string[]>([]);
    const [personality, setPersonality] = React.useState<string>('');
    const [dogLikes, setDogLikes] = React.useState<string[]>([]);
    const [tagline, setTagline] = React.useState<string>('');
    const [treat, setTreat] = React.useState<string>('');
    const [availableForBreeding, setAvailableForBreeding] = React.useState<boolean>(false);
    const [breedClassification, setBreedClassification] = React.useState<string>('mixed_breed');
    const [profileType, setProfileType] = React.useState<string>('breeding');
    const [status, setStatus] = React.useState<string>('active');
    const [profileStatus, setProfileStatus] = React.useState<string>('submitted');

    // Files handling
    const [existingFiles, setExistingFiles] = React.useState<any>({ profile_picture: [], pictures: [], video: [], thumbnail: [], health_document: [], pedigree: [], breed_certification: [], vaccination_certification: [], flea_documents: [] });
    const [removeFileIds, setRemoveFileIds] = React.useState<string[]>([]);
    const [newFiles, setNewFiles] = React.useState<Record<string, File[]>>({});
    const newFilesRef = React.useRef<Record<string, File[]>>({});
    const [newFilePreviews, setNewFilePreviews] = React.useState<Record<string, string>>({});
    const [pendingHealthDocs, setPendingHealthDocs] = React.useState<Array<{ title: string; file: File }>>([]);
    const [healthDocTitle, setHealthDocTitle] = React.useState<string>('');
    const [healthDocFile, setHealthDocFile] = React.useState<File | null>(null);

    const handleEditProfilePicture = (file: File | null) => {
        if (!file) return;
        const existing = existingFiles.profile_picture?.[0];
        if (existing && existing._id) {
            setRemoveFileIds(prev => prev.includes(existing._id) ? prev : [...prev, existing._id]);
        }
        const url = URL.createObjectURL(file);
        setNewFilePreviews(prev => ({ ...prev, profile_picture: url }));
        setNewFiles((prev: Record<string, File[]>) => { const next = { ...prev, profile_picture: [file] }; newFilesRef.current = next; return next; });
        setExistingFiles((prev: any) => ({ ...prev, profile_picture: [{ file_path: url }] }));
    };

    const handleEditPictureAtIndex = (index: number, file: File | null) => {
        if (!file) return;
        const current = Array.isArray(existingFiles.pictures) ? existingFiles.pictures[index] : undefined;
        if (current && current._id) {
            setRemoveFileIds(prev => prev.includes(current._id) ? prev : [...prev, current._id]);
        }
        const preview = URL.createObjectURL(file);
        setNewFiles((prev: Record<string, File[]>) => { const next = { ...prev, pictures: [...(prev.pictures || []), file] }; newFilesRef.current = next; return next; });
        setExistingFiles((prev: any) => {
            const next = { ...prev } as any;
            const arr = Array.isArray(prev.pictures) ? [...prev.pictures] : [];
            arr[index] = { file_path: preview };
            next.pictures = arr;
            return next;
        });
    };

    // Options
    const [dogCharacterOptions, setDogCharacterOptions] = React.useState<Array<{ _id: string; name: string }>>([]);
    const [dogLikeOptions, setDogLikeOptions] = React.useState<Array<{ _id: string; name: string }>>([]);
    const [breedOptions, setBreedOptions] = React.useState<Array<{ _id: string; name: string }>>([]);

    // Tag-style selector state
    const [dogLikeQuery, setDogLikeQuery] = React.useState<string>('');
    const [dogCharQuery, setDogCharQuery] = React.useState<string>('');
    const [likesOpen, setLikesOpen] = React.useState<boolean>(false);
    const [charsOpen, setCharsOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        const load = async () => {
            if (!dogId) { setLoading(false); return; }
            try {
                setLoading(true);
                const res: any = await DogService.getDogById(dogId);
                if (res.status === 1 && res.data) {
                    // setDog(res.data);
                    setDogName(res.data.dog_name || '');
                    setBreed((res.data.breed && typeof res.data.breed === 'object') ? res.data.breed._id : (res.data.breed || ''));
                    setGender(res.data.gender || 'male');
                    setAge(res.data.age || '');
                    setColour(res.data.colour || '');
                    setCharacter(Array.isArray(res.data.character) ? res.data.character.map((c: any) => typeof c === 'object' ? c._id : c) : []);
                    setPersonality(res.data.personality || '');
                    setDogLikes(Array.isArray(res.data.dog_likes) ? res.data.dog_likes.map((d: any) => typeof d === 'object' ? d._id : d) : []);
                    setTagline(res.data.dog_date_tagline || '');
                    setTreat(res.data.favorite_dog_treat || '');
                    setAvailableForBreeding(!!res.data.available_for_breeding);
                    setBreedClassification(res.data.breed_classification || 'mixed_breed');
                    setProfileType(res.data.profile_type || 'breeding');
                    setStatus(res.data.status || 'active');
                    setProfileStatus(res.data.profile_status || 'submitted');

                    // Prepare existing files buckets
                    const ef: any = { profile_picture: [], pictures: [], video: [], thumbnail: [], health_document: [], pedigree: [], breed_certification: [], vaccination_certification: [], flea_documents: [] };
                    if (res.data.profile_picture) ef.profile_picture = [res.data.profile_picture];
                    if (Array.isArray(res.data.pictures)) ef.pictures = res.data.pictures;
                    if (res.data.video) ef.video = [res.data.video];
                    if (res.data.thumbnail) ef.thumbnail = [res.data.thumbnail];
                    if (Array.isArray(res.data.health_document)) ef.health_document = res.data.health_document;
                    if (Array.isArray(res.data.pedigree)) ef.pedigree = res.data.pedigree;
                    if (res.data.breed_certification) ef.breed_certification = [res.data.breed_certification];
                    if (res.data.vaccination_certification) ef.vaccination_certification = [res.data.vaccination_certification];
                    if (res.data.flea_documents) ef.flea_documents = [res.data.flea_documents];
                    setExistingFiles(ef);
                } else {
                    showError('Error', res.message || 'Failed to load dog');
                }
            } catch (err: any) {
                handleApiError(err, 'Failed to load dog');
            } finally {
                setLoading(false);
            }
        };
        const loadOptions = async () => {
            try {
                const [chars, likes, breeds] = await Promise.all([
                    DogCharacterService.getDogCharacters({ status: 'active', limit: 200 } as any),
                    DogLikeService.getDogLikes({ status: 'active', limit: 200 } as any),
                    BreedService.getBreeds({ status: 'active', limit: 500 } as any),
                ]);
                setDogCharacterOptions((chars as any[]).map((c: any) => ({ _id: c._id, name: c.name })));
                setDogLikeOptions((likes as any[]).map((l: any) => ({ _id: l._id, name: l.name })));
                setBreedOptions((breeds as any[]).map((b: any) => ({ _id: b._id, name: b.name })));
            } catch { }
        };
        load();
        loadOptions();
    }, [dogId]);

    const removeExistingFile = (relationKey: string, file: any, index?: number) => {
        if (file && file._id) {
            setRemoveFileIds(prev => prev.includes(file._id) ? prev : [...prev, file._id]);
        }
        setExistingFiles((prev: any) => {
            const next: any = { ...prev };
            const currentArr = Array.isArray(prev[relationKey]) ? prev[relationKey] : [];
            if (typeof index === 'number') {
                next[relationKey] = currentArr.filter((_: any, i: number) => i !== index);
            } else if (file && file._id) {
                next[relationKey] = currentArr.filter((f: any) => f._id !== file._id);
            } else {
                next[relationKey] = [];
            }
            return next;
        });
    };

    const handleNewFilesChange = (field: string, files: FileList | null) => {
        if (!files) return;
        setNewFiles((prev: Record<string, File[]>) => {
            const existing = prev[field] || [];
            const next = { ...prev, [field]: [...existing, ...Array.from(files)] };
            newFilesRef.current = next;
            return next;
        });
    };

    const handleEditSpecificDoc = (field: 'breed_certification' | 'vaccination_certification' | 'flea_documents', file: File | null) => {
        if (!file) return;
        // mark existing file for removal if present
        const existing = existingFiles[field]?.[0];
        if (existing && existing._id) {
            setRemoveFileIds(prev => prev.includes(existing._id) ? prev : [...prev, existing._id]);
        }
        // replace in UI preview
        const url = URL.createObjectURL(file);
        setNewFilePreviews(prev => ({ ...prev, [field]: url }));
        setNewFiles((prev: Record<string, File[]>) => { const next = { ...prev, [field]: [file] }; newFilesRef.current = next; return next; });
        // clear existingFiles bucket to avoid double rendering
        setExistingFiles((prev: any) => ({ ...prev, [field]: [] }));
    };

    const addPendingHealthDoc = (fileOverride?: File, titleOverride?: string) => {
        const titleToUse = (titleOverride ?? healthDocTitle).trim();
        const fileToUse = fileOverride ?? healthDocFile;
        if (!titleToUse || !fileToUse) return;
        setPendingHealthDocs(prev => [...prev, { title: titleToUse, file: fileToUse }]);
        setHealthDocTitle('');
        setHealthDocFile(null);
        const input = document.getElementById('add_health_doc_file_input') as HTMLInputElement | null;
        if (input) input.value = '';
    };

    const removePendingHealthDoc = (index: number) => {
        setPendingHealthDocs(prev => prev.filter((_, i) => i !== index));
    };

    const handleEditHealthDocAtIndex = (index: number, doc: any, file: File | null) => {
        if (!file) return;
        if (doc && doc._id) {
            setRemoveFileIds(prev => prev.includes(doc._id) ? prev : [...prev, doc._id]);
        }
        const url = URL.createObjectURL(file);
        setPendingHealthDocs(prev => [...prev, { title: doc?.title || `Health Document ${index + 1}`, file }]);
        setExistingFiles((prev: any) => {
            const next = { ...prev } as any;
            const arr = Array.isArray(prev.health_document) ? [...prev.health_document] : [];
            arr[index] = { ...(arr[index] || {}), title: doc?.title, file_path: url };
            next.health_document = arr;
            return next;
        });
    };

    const normalizeFileType = (mime: string): string => {
        if (!mime) return 'image';
        if (mime.startsWith('image/')) return 'image';
        if (mime.startsWith('video/')) return 'video';
        if (mime === 'application/pdf') return 'pdf';
        return 'image';
    };

    const uploadNewFiles = async (): Promise<Array<{ relation_field: string; files: Array<{ title?: string; file_path: string; file_type: string }> }>> => {
        const groups: Array<{ relation_field: string; files: Array<{ title?: string; file_path: string; file_type: string }> }> = [];
        const filesMap = newFilesRef.current && Object.keys(newFilesRef.current).length ? newFilesRef.current : newFiles;
        for (const field of Object.keys(filesMap)) {
            const files = filesMap[field];
            if (!files || files.length === 0) continue;
            // request presigned urls
            const req = { files: files.map(f => ({ file_name: f.name, file_type: f.type })) };
            const pres = await AWSService.generateMultiplePresignedUrls(req as any);
            if (pres.status !== 1) continue;
            const map = pres.data?.files || [];
            // upload
            await AWSService.uploadMultipleFilesToS3(map.map((m: any, idx: number) => ({ presignedUrl: m.presignedUrl, file: files[idx] })));
            // group
            groups.push({ relation_field: field, files: map.map((m: any) => ({ file_path: m.fileUrl, file_type: normalizeFileType(m.file_type) })) });
        }
        // handle titled health documents separately
        if (pendingHealthDocs.length > 0) {
            const req = { files: pendingHealthDocs.map(d => ({ file_name: d.file.name, file_type: d.file.type })) } as any;
            const pres = await AWSService.generateMultiplePresignedUrls(req);
            if (pres.status === 1) {
                const map = pres.data?.files || [];
                await AWSService.uploadMultipleFilesToS3(map.map((m: any, idx: number) => ({ presignedUrl: m.presignedUrl, file: pendingHealthDocs[idx].file })));
                groups.push({ relation_field: 'health_document', files: map.map((m: any, idx: number) => ({ title: pendingHealthDocs[idx].title, file_path: m.fileUrl, file_type: normalizeFileType(m.file_type) })) });
            }
        }
        return groups;
    };

    const handleSave = async () => {
        if (!dogId) return;
        try {
            setSaving(true);
            const add_files = await uploadNewFiles();
            const payload: any = {
                dog_name: dogName,
                breed,
                gender,
                age: age === '' ? undefined : Number(age),
                colour,
                character,
                personality,
                dog_likes: dogLikes,
                dog_date_tagline: tagline,
                favorite_dog_treat: treat,
                available_for_breeding: availableForBreeding,
                breed_classification: breedClassification,
                profile_type: profileType,
                status,
                profile_status: profileStatus,
                add_files,
                remove_file_ids: removeFileIds,
            };

            console.log('payloadpayloadpayload', payload);
            const res: any = await DogService.adminEditDog(dogId, payload);
            if (res.status === 1) {
                showSuccess('Saved', 'Dog profile updated successfully');
            } else {
                showError('Error', res.message || 'Failed to update dog');
            }
        } catch (err: any) {
            handleApiError(err, 'Failed to update dog');
        } finally {
            setSaving(false);
        }
    };

    if (!dogId) return <div className="p-3">Dog ID missing</div>;
    if (loading) return <div className="p-4 text-center"><Spinner animation="border" /></div>;

    return (
        <React.Fragment>
            <Card>
                <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>Edit Dog</h5>
                    <div>
                        <Link to={`/dogs/view-dog?id=${dogId}`} className="btn btn-outline-secondary me-2">Back</Link>
                        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row className="gy-3">
                        <Col md={6}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Dog Name</Form.Label>
                                <Form.Control value={dogName} onChange={(e) => setDogName(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="neutered male">Neutered Male</option>
                                    <option value="spayed female">Spayed Female</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Age (years)</Form.Label>
                                <Form.Control type="number" min={0} value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value))))} />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Colour</Form.Label>
                                <Form.Control value={colour} onChange={(e) => setColour(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Profile Type</Form.Label>
                                <Form.Select value={profileType} onChange={(e) => setProfileType(e.target.value)}>
                                    <option value="breeding">Breeding</option>
                                    <option value="playmates">Playmates</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Breed Classification</Form.Label>
                                <Form.Select value={breedClassification} onChange={(e) => setBreedClassification(e.target.value)}>
                                    <option value="mixed_breed">Mixed Breed</option>
                                    <option value="majority_breed">Majority Breed</option>
                                    <option value="purebred">Purebred</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Dog Likes</Form.Label>
                                <div className="position-relative">
                                    <div className="form-control d-flex align-items-center flex-wrap gap-2" onClick={() => setLikesOpen(true)}>
                                        {dogLikes.map((id) => {
                                            const name = dogLikeOptions.find(o => o._id === id)?.name || id;
                                            return (
                                                <span key={id} className="badge bg-secondary">
                                                    {name}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-link text-white ms-2 p-0"
                                                        onClick={(e) => { e.stopPropagation(); setDogLikes(prev => prev.filter(x => x !== id)); }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            );
                                        })}
                                        <input
                                            className="border-0 flex-grow-1"
                                            style={{ outline: 'none' }}
                                            value={dogLikeQuery}
                                            onFocus={() => setLikesOpen(true)}
                                            onChange={(e) => setDogLikeQuery(e.target.value)}
                                            onBlur={() => setTimeout(() => setLikesOpen(false), 150)}
                                            placeholder="Type to search..."
                                        />
                                    </div>
                                    {likesOpen && (
                                        <div className="dropdown-menu show w-100" style={{ maxHeight: 220, overflowY: 'auto' }}>
                                            {dogLikeOptions
                                                .filter(o => !dogLikes.includes(o._id) && o.name.toLowerCase().includes(dogLikeQuery.toLowerCase()))
                                                .map(o => (
                                                    <button
                                                        key={o._id}
                                                        type="button"
                                                        className="dropdown-item"
                                                        onMouseDown={(e) => { e.preventDefault(); }}
                                                        onClick={() => {
                                                            setDogLikes(prev => [...prev, o._id]);
                                                            setDogLikeQuery('');
                                                            setLikesOpen(true);
                                                        }}
                                                    >
                                                        {o.name}
                                                    </button>
                                                ))}
                                            {dogLikeOptions.filter(o => !dogLikes.includes(o._id) && o.name.toLowerCase().includes(dogLikeQuery.toLowerCase())).length === 0 && (
                                                <div className="px-3 py-2 text-muted small">No matches</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Character</Form.Label>
                                <div className="position-relative">
                                    <div className="form-control d-flex align-items-center flex-wrap gap-2" onClick={() => setCharsOpen(true)}>
                                        {character.map((id) => {
                                            const name = dogCharacterOptions.find(o => o._id === id)?.name || id;
                                            return (
                                                <span key={id} className="badge bg-secondary">
                                                    {name}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-link text-white ms-2 p-0"
                                                        onClick={(e) => { e.stopPropagation(); setCharacter(prev => prev.filter(x => x !== id)); }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            );
                                        })}
                                        <input
                                            className="border-0 flex-grow-1"
                                            style={{ outline: 'none' }}
                                            value={dogCharQuery}
                                            onFocus={() => setCharsOpen(true)}
                                            onChange={(e) => setDogCharQuery(e.target.value)}
                                            onBlur={() => setTimeout(() => setCharsOpen(false), 150)}
                                            placeholder="Type to search..."
                                        />
                                    </div>
                                    {charsOpen && (
                                        <div className="dropdown-menu show w-100" style={{ maxHeight: 220, overflowY: 'auto' }}>
                                            {dogCharacterOptions
                                                .filter(o => !character.includes(o._id) && o.name.toLowerCase().includes(dogCharQuery.toLowerCase()))
                                                .map(o => (
                                                    <button
                                                        key={o._id}
                                                        type="button"
                                                        className="dropdown-item"
                                                        onMouseDown={(e) => { e.preventDefault(); }}
                                                        onClick={() => {
                                                            setCharacter(prev => [...prev, o._id]);
                                                            setDogCharQuery('');
                                                            setCharsOpen(true);
                                                        }}
                                                    >
                                                        {o.name}
                                                    </button>
                                                ))}
                                            {dogCharacterOptions.filter(o => !character.includes(o._id) && o.name.toLowerCase().includes(dogCharQuery.toLowerCase())).length === 0 && (
                                                <div className="px-3 py-2 text-muted small">No matches</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Breed</Form.Label>
                                <Form.Select value={breed} onChange={(e) => setBreed(e.target.value)}>
                                    <option value="">Select breed</option>
                                    {breedOptions.map(opt => (
                                        <option key={opt._id} value={opt._id}>{opt.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Tagline</Form.Label>
                                <Form.Control value={tagline} onChange={(e) => setTagline(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Favorite Treat</Form.Label>
                                <Form.Control value={treat} onChange={(e) => setTreat(e.target.value)} />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Status</Form.Label>
                                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Profile Status</Form.Label>
                                <Form.Select value={profileStatus} onChange={(e) => setProfileStatus(e.target.value)}>
                                    <option value="submitted">Submitted</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex align-items-center">
                            <Form.Check type="switch" id="available_for_breeding" label="Available for breeding" checked={availableForBreeding} onChange={(e) => setAvailableForBreeding(e.target.checked)} />
                        </Col>

                        <Col md={12}>
                            <h6 className="mt-2">Files</h6>
                            <div className="text-muted small mb-2">Use inputs below to upload new files. Existing files can be marked for removal.</div>

                            <Row className="mt-1">
                                <Col md={6}>
                                    <h6 className="mb-2 mt-3">Images</h6>
                                    {existingFiles.profile_picture?.length > 0 && (
                                        <div className="mb-3">
                                            <div style={{ position: 'relative', width: '100%', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '12px', overflow: 'hidden' }}>
                                                <div style={{ width: '100%', paddingTop: '40%', position: 'relative' }}>
                                                    <img
                                                        src={existingFiles.profile_picture[0]?.file_path || IMAGES.Dog}
                                                        alt="Profile Picture"
                                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => { (e.target as HTMLImageElement).src = IMAGES.Dog; }}
                                                    />
                                                </div>
                                                <div style={{ position: 'absolute', right: 12, bottom: 12 }}>
                                                    <input id="change_profile_picture_input" type="file" accept="image/*" hidden onChange={(e) => handleEditProfilePicture((e.target as HTMLInputElement).files?.[0] || null)} />
                                                    <Button size="sm" onClick={() => (document.getElementById('change_profile_picture_input') as HTMLInputElement)?.click()}>
                                                        Change profile picture
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <Row>
                                        {Array.isArray(existingFiles.pictures) && existingFiles.pictures.map((p: any, idx: number) => (
                                            <Col xs={6} sm={6} md={3} className="mb-3" key={p._id || idx}>
                                                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '12px', overflow: 'hidden' }}>
                                                    <img src={p.file_path || IMAGES.Dog} alt={`Picture ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = IMAGES.Dog; }} />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingFile('pictures', p, idx)}
                                                        style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: '1px solid #dee2e6', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        aria-label="Remove"
                                                    >
                                                        <Icon icon="mdi:close" width={16} height={16} />
                                                    </button>
                                                    <input id={`edit_picture_${idx}_input`} type="file" accept="image/*" hidden onChange={(e) => handleEditPictureAtIndex(idx, (e.target as HTMLInputElement).files?.[0] || null)} />
                                                    <button
                                                        type="button"
                                                        onClick={() => (document.getElementById(`edit_picture_${idx}_input`) as HTMLInputElement)?.click()}
                                                        style={{ position: 'absolute', bottom: 8, right: 8, background: '#fff', border: '1px solid #dee2e6', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        aria-label="Edit"
                                                    >
                                                        <Icon icon="mdi:pencil" width={16} height={16} />
                                                    </button>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>

                                    <div className="d-flex gap-2 mb-3">
                                        <input id="add_profile_picture_input" type="file" accept="image/*" hidden onChange={(e) => {
                                            const files = (e.target as HTMLInputElement).files;
                                            if (!files || files.length === 0) return;
                                            setNewFiles(prev => ({ ...prev, profile_picture: [files[0]] }));
                                            handleEditProfilePicture(files[0]);
                                        }} />
                                        <Button variant="outline-primary" size="sm" onClick={() => (document.getElementById('add_profile_picture_input') as HTMLInputElement)?.click()}>+ Add Profile Picture</Button>

                                        <input id="add_pictures_input" type="file" accept="image/*" multiple hidden onChange={(e) => handleNewFilesChange('pictures', (e.target as HTMLInputElement).files)} />
                                        <Button variant="outline-primary" size="sm" onClick={() => (document.getElementById('add_pictures_input') as HTMLInputElement)?.click()}>+ Add Pictures</Button>
                                    </div>

                                    {Array.isArray(existingFiles.video) && existingFiles.video.length > 0 && (
                                        <>
                                            <h6 className="mb-2 mt-3">Video</h6>
                                            <Row className="mt-1">
                                                {existingFiles.video.map((v: any, idx: number) => (
                                                    <Col md={12} className="mb-3" key={v._id || idx}>
                                                        <Card>
                                                            <Card.Body className="text-center p-2">
                                                                <div className="w-100" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                                                                    <video controls style={{ width: '100%', height: '260px' }} src={v.file_path} />
                                                                </div>
                                                                <div className="mt-2">
                                                                    <Button variant="outline-danger" size="sm" onClick={() => removeExistingFile('video', v, idx)}>Remove</Button>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </>
                                    )}
                                </Col>

                                <Col md={6}>
                                    <h6 className="mb-2 mt-3">Documents</h6>
                                    <Row className="mt-1">
                                        {Array.isArray(existingFiles.health_document) && existingFiles.health_document.map((doc: any, idx: number) => (
                                            <Col md={6} className="mb-3" key={doc._id || idx}>
                                                <div style={{ position: 'relative', border: '1px solid #dee2e6', borderRadius: '12px', padding: '12px' }}>
                                                    <p className="text-center" style={{ fontSize: '12px', marginBottom: 8 }}>{doc.title || `Health Document ${idx + 1}`}</p>
                                                    {doc.file_path && (
                                                        <div className="text-center">
                                                            <a href={doc.file_path} target="_blank" rel="noreferrer" className="btn btn-outline-warning btn-sm">View</a>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingFile('health_document', doc, idx)}
                                                        style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: '1px solid #dee2e6', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        aria-label="Remove"
                                                    >
                                                        <Icon icon="mdi:close" width={16} height={16} />
                                                    </button>
                                                    <input id={`edit_health_doc_${idx}_input`} type="file" hidden onChange={(e) => handleEditHealthDocAtIndex(idx, doc, (e.target as HTMLInputElement).files?.[0] || null)} />
                                                    <button
                                                        type="button"
                                                        onClick={() => (document.getElementById(`edit_health_doc_${idx}_input`) as HTMLInputElement)?.click()}
                                                        style={{ position: 'absolute', bottom: 8, right: 8, background: '#fff', border: '1px solid #dee2e6', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        aria-label="Edit"
                                                    >
                                                        <Icon icon="mdi:pencil" width={16} height={16} />
                                                    </button>
                                                </div>
                                            </Col>
                                        ))}
                                        {[{ key: 'breed_certification', label: 'Breed Certification' }, { key: 'vaccination_certification', label: 'Vaccination Certification' }, { key: 'flea_documents', label: 'Flea Documents' }].map(({ key, label }) => {
                                            const preview = newFilePreviews[key];
                                            const hasExisting = existingFiles[key]?.length > 0;
                                            const viewUrl = preview || (hasExisting ? existingFiles[key][0]?.file_path : undefined);
                                            return (
                                                <Col md={6} className="mb-3" key={key}>
                                                    <div style={{ position: 'relative', border: '1px solid #dee2e6', borderRadius: '12px', padding: '12px' }}>
                                                        <p className="text-center" style={{ fontSize: '12px', marginBottom: 8 }}>{label}</p>
                                                        {viewUrl ? (
                                                            <div className="text-center">
                                                                <a href={viewUrl} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">View</a>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted small d-block mb-2 text-center">No file</span>
                                                        )}
                                                        <input id={`edit_${key}_input`} type="file" hidden onChange={(e) => handleEditSpecificDoc(key as any, (e.target as HTMLInputElement).files?.[0] || null)} />
                                                        <button
                                                            type="button"
                                                            onClick={() => (document.getElementById(`edit_${key}_input`) as HTMLInputElement)?.click()}
                                                            style={{ position: 'absolute', bottom: 8, right: 8, background: '#fff', border: '1px solid #dee2e6', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            aria-label="Edit"
                                                        >
                                                            <Icon icon="mdi:pencil" width={16} height={16} />
                                                        </button>
                                                        {(hasExisting || preview) && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (preview) {
                                                                        setNewFilePreviews(prev => { const n = { ...prev }; delete n[key]; return n; });
                                                                        setNewFiles(prev => { const n: any = { ...prev }; delete n[key]; return n; });
                                                                    }
                                                                    if (hasExisting) {
                                                                        removeExistingFile(key as any, existingFiles[key][0], 0);
                                                                    }
                                                                }}
                                                                style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: '1px solid #dee2e6', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                aria-label="Remove"
                                                            >
                                                                <Icon icon="mdi:close" width={16} height={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>

                                    <div className="mt-3">
                                        <div style={{ border: '1px dashed #dee2e6', borderRadius: '12px', padding: '16px', background: '#f8f9fa' }}>
                                            <Row className="g-2 align-items-end">
                                                <Col md={8}>
                                                    <Form.Label className="mb-1">Health Document Title</Form.Label>
                                                    <Form.Control value={healthDocTitle} onChange={(e) => setHealthDocTitle(e.target.value)} placeholder="e.g. Bloodwork, X-Ray" />
                                                </Col>
                                                <Col md={4} className="pb-1 d-flex justify-content-end">
                                                    <input id="add_health_doc_file_input" type="file" accept="image/*,application/pdf" hidden onChange={(e) => {
                                                        const f = (e.target as HTMLInputElement).files?.[0] || null;
                                                        if (f) addPendingHealthDoc(f);
                                                    }} />
                                                    <Button variant="primary" onClick={() => {
                                                        if (!healthDocTitle.trim()) return;
                                                        (document.getElementById('add_health_doc_file_input') as HTMLInputElement)?.click();
                                                    }}>
                                                        <Icon icon="mdi:file-plus-outline" width={18} height={18} className="me-1" /> Add
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    {pendingHealthDocs.length > 0 && (
                                        <div className="mt-2">
                                            <div className="text-muted small mb-1">Pending Health Documents</div>
                                            <Row>
                                                {pendingHealthDocs.map((d, i) => (
                                                    <Col md={6} className="mb-2" key={`${d.title}-${i}`}>
                                                        <Card>
                                                            <Card.Body className="text-center">
                                                                <p style={{ fontSize: '12px', marginBottom: 8 }}>{d.title}</p>
                                                                <div className="mt-1">
                                                                    <Button variant="outline-danger" size="sm" onClick={() => removePendingHealthDoc(i)}>Remove</Button>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};

export default EditDog;


